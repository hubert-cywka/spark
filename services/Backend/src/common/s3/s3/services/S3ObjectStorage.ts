import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Archiver from "archiver";
import { type S3, InjectS3 } from "nestjs-s3";
import { Readable, Writable } from "node:stream";
import {
    ReadableStream as NodeReadableStream,
    TransformStream as NodeTransformStream,
    WritableStream as NodeWritableStream,
} from "node:stream/web";

import { type IObjectStorage } from "@/common/s3/services/IObjectStorage";

// TODO: TTL
// TODO: Don't overwrite if checksum is the same?
// TODO: Zip once

@Injectable()
export class S3ObjectStorage implements IObjectStorage {
    private readonly bucketName: string;

    constructor(
        @InjectS3() private readonly s3: S3,
        @Inject(ConfigService) private readonly configService: ConfigService
    ) {
        this.bucketName = this.configService.getOrThrow("s3.bucket.name");
    }

    async upload(key: string, content: Buffer): Promise<void> {
        const s3Key = key.startsWith("/") ? key.substring(1) : key;

        await this.s3.send(
            new PutObjectCommand({
                Bucket: this.bucketName,
                Key: s3Key,
                Body: content,
                ContentType: "text/csv",
            })
        );
    }

    async zipToStream(keyPrefix: string): Promise<NodeJS.ReadableStream> {
        const archive = Archiver("zip");

        const { readable, writable } = new NodeTransformStream<string, string>();
        const nodeWritable = Writable.fromWeb(writable as NodeWritableStream<string>);
        const nodeReadable = Readable.fromWeb(readable as NodeReadableStream<string>);

        archive.pipe(nodeWritable);

        const objects = await this.s3.send(
            new ListObjectsV2Command({
                Bucket: this.bucketName,
                Prefix: keyPrefix,
            })
        );

        for (const obj of objects.Contents || []) {
            const file = await this.s3.send(
                new GetObjectCommand({
                    Bucket: this.bucketName,
                    Key: obj.Key,
                })
            );

            if (file.Body && obj.Key) {
                archive.append(file.Body as Readable, { name: obj.Key });
            }
        }

        void archive.finalize();
        return nodeReadable;
    }
}
