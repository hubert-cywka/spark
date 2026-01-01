import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { getS3ConnectionToken } from "nestjs-s3";
import path from "node:path";
import { initializeTransactionalContext } from "typeorm-transactional";
import unzipper from "unzipper";

import { ObjectStorageModule } from "@/common/objectStorage/ObjectStorage.module";
import { S3ObjectStorage } from "@/common/objectStorage/s3/services/S3ObjectStorage";
import { TestConfig } from "@/config/testConfiguration";

describe("S3ObjectStorage", () => {
    let app: TestingModule;
    let objectStorage: S3ObjectStorage;

    const FILE_PATH_PREFIX = "dir/path";
    const FILE_PATH_1 = `${FILE_PATH_PREFIX}/file-1`;
    const FILE_PATH_2 = `${FILE_PATH_PREFIX}/file-2`;
    const FILE_PATH_3 = `${FILE_PATH_PREFIX}/file-3`;
    const ZIP_PATH = "archives/zip";

    beforeAll(async () => {
        initializeTransactionalContext();

        app = await Test.createTestingModule({
            imports: [
                await ConfigModule.forRoot({ load: [TestConfig], isGlobal: true }),
                ObjectStorageModule.forRootAsync({
                    useFactory: (configService: ConfigService) => ({
                        credentials: {
                            accessKeyId: configService.getOrThrow<string>("s3.accessKeyId"),
                            secretAccessKey: configService.getOrThrow<string>("s3.secretAccessKey"),
                        },
                        region: configService.getOrThrow<string>("s3.region"),
                        endpoint: configService.getOrThrow<string>("s3.endpoint"),
                    }),
                    inject: [ConfigService],
                    global: true,
                }),
            ],
        }).compile();

        const s3 = app.get(getS3ConnectionToken(""));
        const configService = app.get<ConfigService>(ConfigService);
        objectStorage = new S3ObjectStorage(s3, configService);
    });

    afterAll(async () => {
        await app.close();
    });

    afterEach(async () => {
        await cleanup();
    });

    describe("exists", () => {
        it("should return false if file does not exist", async () => {
            const result = await objectStorage.exists(FILE_PATH_1);

            expect(result).toBe(false);
        });

        it("should return true if file exists", async () => {
            await createFile(FILE_PATH_1);

            const result = await objectStorage.exists(FILE_PATH_1);

            expect(result).toBe(true);
        });
    });

    describe("upload", () => {
        it("should create a file", async () => {
            const mockContent = Buffer.from("mock content");
            const mockType = "text/plain";

            await objectStorage.upload(FILE_PATH_1, mockContent, mockType);
            const result = await objectStorage.exists(FILE_PATH_1);

            expect(result).toBe(true);
        });
    });

    describe("delete", () => {
        it("should delete file", async () => {
            await createFile(FILE_PATH_1);

            await objectStorage.delete([FILE_PATH_1]);
            const exists = await objectStorage.exists(FILE_PATH_1);

            expect(exists).toBe(false);
        });

        it("should delete all mentioned files", async () => {
            await createFile(FILE_PATH_1);
            await createFile(FILE_PATH_2);
            await createFile(FILE_PATH_3);

            await objectStorage.delete([FILE_PATH_1, FILE_PATH_2, FILE_PATH_3]);
            const exists1 = await objectStorage.exists(FILE_PATH_1);
            const exists2 = await objectStorage.exists(FILE_PATH_2);
            const exists3 = await objectStorage.exists(FILE_PATH_3);

            expect(exists1).toBe(false);
            expect(exists2).toBe(false);
            expect(exists3).toBe(false);
        });

        it("should not delete any files with different path", async () => {
            await createFile(FILE_PATH_1);
            await createFile(FILE_PATH_2);

            await objectStorage.delete([FILE_PATH_1]);
            const exists1 = await objectStorage.exists(FILE_PATH_1);
            const exists2 = await objectStorage.exists(FILE_PATH_2);

            expect(exists1).toBe(false);
            expect(exists2).toBe(true);
        });

        it("should not throw if the file does not exist", async () => {
            expect(() => objectStorage.exists(FILE_PATH_1)).not.toThrow();
        });
    });

    describe("zipToStream", () => {
        it("should return a stream containing zipped files", async () => {
            await createFile(FILE_PATH_1);
            await createFile(FILE_PATH_2);

            const zipStream = await objectStorage.zipToStream(FILE_PATH_PREFIX);
            const files = await unpackZipStream(zipStream);

            expect(files).toContain(path.basename(FILE_PATH_1));
            expect(files).toContain(path.basename(FILE_PATH_2));
            expect(files.length).toBe(2);
        });
    });

    describe("zipToStorage", () => {
        it("should upload a new file", async () => {
            await createFile(FILE_PATH_1);
            await createFile(FILE_PATH_2);

            await objectStorage.zipToStorage(FILE_PATH_PREFIX, ZIP_PATH);
            const result = await objectStorage.exists(ZIP_PATH);

            expect(result).toBe(true);
        });

        it("should upload a file containing zipped files", async () => {
            await createFile(FILE_PATH_1);
            await createFile(FILE_PATH_2);
            await createFile(FILE_PATH_3);

            await objectStorage.zipToStorage(FILE_PATH_PREFIX, ZIP_PATH);
            const zipStream = await objectStorage.download(ZIP_PATH);
            const files = await unpackZipStream(zipStream);

            expect(files).toContain(path.basename(FILE_PATH_1));
            expect(files).toContain(path.basename(FILE_PATH_2));
            expect(files).toContain(path.basename(FILE_PATH_3));
            expect(files.length).toBe(3);
        });
    });

    const unpackZipStream = async (zipStream: NodeJS.ReadableStream) => {
        const files: string[] = [];
        const parser = unzipper.Parse();

        const processingFinished = new Promise((resolve, reject) => {
            parser.on("entry", (entry) => {
                files.push(entry.path);
                entry.autodrain();
            });
            parser.on("error", reject);
            parser.on("finish", resolve);
        });

        zipStream.pipe(parser);
        await processingFinished;
        return files;
    };

    const createFile = async (path: string) => {
        const mockContent = Buffer.from("mock content");
        const mockType = "text/plain";
        return await objectStorage.upload(path, mockContent, mockType);
    };

    const cleanup = async () => {
        return await objectStorage.delete([FILE_PATH_1, FILE_PATH_2, FILE_PATH_3, ZIP_PATH]);
    };
});
