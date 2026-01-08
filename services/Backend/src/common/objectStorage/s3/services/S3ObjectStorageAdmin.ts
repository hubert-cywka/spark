import { PutBucketLifecycleConfigurationCommand } from "@aws-sdk/client-s3";
import { Logger } from "@nestjs/common";
import { type S3, InjectS3 } from "nestjs-s3";

import type { IObjectStorageAdmin } from "@/common/objectStorage/services/IObjectStorageAdmin";

export class S3ObjectStorageAdmin implements IObjectStorageAdmin {
    private readonly logger = new Logger(S3ObjectStorageAdmin.name);
    constructor(@InjectS3() private readonly s3: S3) {}

    public async setBucketTTL(days: number, bucket: string): Promise<void> {
        try {
            await this.s3.send(
                new PutBucketLifecycleConfigurationCommand({
                    Bucket: bucket,
                    LifecycleConfiguration: {
                        Rules: [
                            {
                                ID: `TTL-root-${days}d`,
                                Status: "Enabled",
                                Expiration: {
                                    Days: days,
                                },
                            },
                        ],
                    },
                })
            );

            this.logger.log({ ttl: `${days}d`, bucket }, "Object storage lifecycle policy set.");
        } catch (error: unknown) {
            this.logger.error(error, `Failed to set lifecycle policy for bucket ${bucket}.`);
            throw error;
        }
    }
}
