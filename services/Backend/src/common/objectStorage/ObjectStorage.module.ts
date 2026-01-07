import { DynamicModule, Module } from "@nestjs/common";
import { getS3ConnectionToken, S3, S3Module } from "nestjs-s3";

import { S3ObjectStorage } from "@/common/objectStorage/s3/services/S3ObjectStorage";
import { S3ObjectStorageAdmin } from "@/common/objectStorage/s3/services/S3ObjectStorageAdmin";
import { getObjectStorageToken } from "@/common/objectStorage/services/IObjectStorage";
import { ObjectStorageAdminToken } from "@/common/objectStorage/services/IObjectStorageAdmin";
import { UseFactory, UseFactoryArgs } from "@/types/UseFactory";

type ObjectStorageModuleForRootOptions = {
    credentials: {
        accessKeyId: string;
        secretAccessKey: string;
    };
    region: string;
    endpoint: string;
};

type ObjectStorageModuleForBucketOptions = {
    bucket: {
        name: string;
    };
};

@Module({})
export class ObjectStorageModule {
    public static registerStorageAsync(
        key: string,
        options: {
            useFactory: UseFactory<ObjectStorageModuleForBucketOptions>;
            inject?: UseFactoryArgs;
            global?: boolean;
        }
    ): DynamicModule {
        return {
            module: ObjectStorageModule,
            providers: [
                {
                    provide: getObjectStorageToken(key),
                    useFactory: async (s3: S3, ...args: UseFactoryArgs) => {
                        const { bucket } = await options.useFactory(...args);
                        return new S3ObjectStorage(s3, bucket.name);
                    },
                    inject: [getS3ConnectionToken(""), ...(options.inject || [])],
                },
            ],
            exports: [getObjectStorageToken(key)],
            global: options.global,
        };
    }

    static forRootAsync(options: {
        useFactory: UseFactory<ObjectStorageModuleForRootOptions>;
        inject?: UseFactoryArgs;
        global?: boolean;
    }): DynamicModule {
        return {
            module: ObjectStorageModule,
            global: options.global,
            imports: [
                S3Module.forRootAsync({
                    useFactory: async (...args: UseFactoryArgs) => {
                        const s3Options = await options.useFactory(...args);

                        return {
                            config: {
                                credentials: {
                                    accessKeyId: s3Options.credentials.accessKeyId,
                                    secretAccessKey: s3Options.credentials.secretAccessKey,
                                },
                                region: s3Options.region,
                                endpoint: s3Options.endpoint,
                                forcePathStyle: true,
                            },
                        };
                    },
                    inject: options.inject || [],
                }),
            ],
            providers: [
                {
                    provide: ObjectStorageAdminToken,
                    useClass: S3ObjectStorageAdmin,
                },
            ],
            exports: [S3Module, ObjectStorageAdminToken],
        };
    }
}
