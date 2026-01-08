import {
    _Object,
    DeleteObjectsCommand,
    GetObjectCommand,
    HeadObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3ServiceException,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { Injectable, Logger } from "@nestjs/common";
import Archiver from "archiver";
import Bottleneck from "bottleneck";
import { type S3, InjectS3 } from "nestjs-s3";
import { PassThrough, Readable } from "node:stream";

import { ObjectBodyEmptyError } from "@/common/objectStorage/errors/ObjectBodyEmpty.error";
import { ObjectDeleteFailedError } from "@/common/objectStorage/errors/ObjectDeleteFailedError.error";
import { ObjectDownloadFailedError } from "@/common/objectStorage/errors/ObjectDownloadFailed.error";
import { ObjectETagEmptyError } from "@/common/objectStorage/errors/ObjectETagEmpty.error";
import { ObjectUploadFailedError } from "@/common/objectStorage/errors/ObjectUploadFailed.error";
import { ObjectZipFailedError } from "@/common/objectStorage/errors/ObjectZipFailed.error";
import { type IObjectStorage } from "@/common/objectStorage/services/IObjectStorage";
import { ObjectManifest } from "@/common/objectStorage/types/ObjectManifest";

const CHUNK_SIZE = 1000;
const CONCURRENT_FILES = 5;

@Injectable()
export class S3ObjectStorage implements IObjectStorage {
    private readonly logger = new Logger(S3ObjectStorage.name);
    private readonly limiter = new Bottleneck({ maxConcurrent: CONCURRENT_FILES });

    constructor(
        @InjectS3() private readonly s3: S3,
        private readonly bucketName: string
    ) {}

    public async exists(path: string): Promise<boolean> {
        try {
            await this.s3.send(
                new HeadObjectCommand({
                    Bucket: this.bucketName,
                    Key: this.normalizePath(path),
                })
            );

            return true;
        } catch (error: unknown) {
            if (this.isFileNotFoundError(error)) {
                return false;
            }

            this.logger.error(error, `Failed to check if file ${path} exists.`);
            throw error;
        }
    }

    public async download(path: string): Promise<Readable> {
        try {
            const response = await this.s3.send(
                new GetObjectCommand({
                    Bucket: this.bucketName,
                    Key: this.normalizePath(path),
                })
            );

            if (!response.Body) {
                throw new ObjectBodyEmptyError();
            }

            return response.Body as Readable;
        } catch (error: unknown) {
            this.logger.error(error, `Failed to download file from ${path}.`);
            throw new ObjectDownloadFailedError(path);
        }
    }

    public async upload(path: string, content: Buffer, contentType: string): Promise<ObjectManifest> {
        try {
            const response = await this.s3.send(
                new PutObjectCommand({
                    Bucket: this.bucketName,
                    Key: this.normalizePath(path),
                    Body: content,
                    ContentType: contentType,
                })
            );

            return { checksum: this.checksumFromETag(response.ETag), path };
        } catch (error: unknown) {
            this.logger.error(error, `Failed to upload file to ${path}.`);
            throw new ObjectUploadFailedError(path);
        }
    }

    public async delete(paths: string[]): Promise<void> {
        for (let i = 0; i < paths.length; i += CHUNK_SIZE) {
            const chunk = paths.slice(i, i + CHUNK_SIZE);
            const response = await this.s3.send(
                new DeleteObjectsCommand({
                    Bucket: this.bucketName,
                    Delete: {
                        Objects: chunk.map((p) => ({ Key: this.normalizePath(p) })),
                    },
                })
            );

            const errors = response.Errors?.filter((e) => e.Code !== "NoSuchKey") ?? [];

            if (errors.length > 0) {
                const failedKeys = errors.map((e) => e.Key ?? "unknown");
                throw new ObjectDeleteFailedError(failedKeys);
            }
        }
    }

    public async zipToStream(pathPrefix: string): Promise<Readable> {
        const archive = this.createNewArchive();
        const stream = this.openStream();
        archive.pipe(stream);

        stream.on("error", (error: Error) => {
            this.logger.error(error, `Stream error during zipping ${pathPrefix}`);
            archive.abort();
        });

        this.processZip(pathPrefix, archive).catch((error: unknown) => {
            this.logger.error(error, "Zip process failed.");
            stream.destroy(error instanceof Error ? error : new Error("Failed to zip due to unknown error."));
        });

        return stream;
    }

    public async zipToStorage(pathPrefix: string, destinationPath: string): Promise<ObjectManifest> {
        const archive = this.createNewArchive();
        const stream = this.openStream();
        archive.pipe(stream);

        try {
            const uploadRequest = new Upload({
                client: this.s3,
                queueSize: CONCURRENT_FILES,
                params: {
                    Bucket: this.bucketName,
                    Key: this.normalizePath(destinationPath),
                    Body: stream,
                    ContentType: "application/zip",
                },
            });

            const [uploadOutput] = await Promise.all([uploadRequest.done(), this.processZip(pathPrefix, archive)]);

            return { checksum: this.checksumFromETag(uploadOutput.ETag), path: destinationPath };
        } catch (error: unknown) {
            archive.abort();
            stream.destroy();

            this.logger.error(error, `Failed to zip and store ${destinationPath}.`);
            throw new ObjectZipFailedError(destinationPath);
        }
    }

    private async processZip(pathPrefix: string, archive: Archiver.Archiver): Promise<void> {
        let continuationToken: string | undefined = undefined;

        try {
            do {
                continuationToken = await this.processZipBatch(pathPrefix, archive, continuationToken);
            } while (continuationToken);

            await archive.finalize();
        } catch (error: unknown) {
            archive.abort();
            throw error;
        }
    }

    private async processZipBatch(pathPrefix: string, archive: Archiver.Archiver, continuationToken?: string) {
        const normalizedPrefix = this.normalizePath(pathPrefix);
        const listResponse = await this.listObjects(normalizedPrefix, continuationToken);

        if (listResponse.Contents) {
            const files = listResponse.Contents.filter((obj) => this.isValidFile(obj));
            const tasks = files.map((obj) => this.limiter.schedule(() => this.appendFileToArchive(obj.Key!, pathPrefix, archive)));
            await Promise.all(tasks);
        }

        return listResponse.NextContinuationToken;
    }

    private async appendFileToArchive(key: string, pathPrefix: string, archive: Archiver.Archiver): Promise<void> {
        const fileResponse = await this.s3.send(
            new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            })
        );

        if (!fileResponse.Body) {
            throw new ObjectBodyEmptyError();
        }

        const fileName = key.replace(pathPrefix, "").replace(/^\//, "");
        archive.append(fileResponse.Body as Readable, { name: fileName || key });
    }

    private async listObjects(prefix: string, token?: string) {
        return this.s3.send(
            new ListObjectsV2Command({
                Bucket: this.bucketName,
                Prefix: prefix,
                ContinuationToken: token,
            })
        );
    }

    private checksumFromETag(eTag?: string) {
        if (!eTag) {
            throw new ObjectETagEmptyError();
        }

        return eTag.replace(/"/g, "");
    }

    private isValidFile(obj: _Object): boolean {
        return !!(obj.Key && !obj.Key.endsWith("/"));
    }

    private normalizePath(path: string): string {
        return path.startsWith("/") ? path.substring(1) : path;
    }

    private createNewArchive() {
        return Archiver("zip", { zlib: { level: 5 } });
    }

    private openStream() {
        return new PassThrough();
    }

    private isFileNotFoundError(error: unknown) {
        return error instanceof S3ServiceException && (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404);
    }
}
