import { DynamicModule, Module } from "@nestjs/common";
import { S3Module } from "nestjs-s3";

import { S3ObjectStorage } from "@/common/s3/s3/services/S3ObjectStorage";
import { ObjectStorageToken } from "@/common/s3/services/IObjectStorage";
import { UseFactory, UseFactoryArgs } from "@/types/UseFactory";

type ObjectStorageModuleOptions = {
    credentials: {
        accessKeyId: string;
        secretAccessKey: string;
    };
    region: string;
    endpoint: string;
};

@Module({})
export class ObjectStorageModule {
    static forRootAsync(options: {
        useFactory: UseFactory<ObjectStorageModuleOptions>;
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
                    provide: ObjectStorageToken,
                    useClass: S3ObjectStorage,
                },
            ],
            exports: [S3Module, ObjectStorageToken],
        };
    }
}
