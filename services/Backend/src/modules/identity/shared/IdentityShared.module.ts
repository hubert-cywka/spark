import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { CacheModule } from "@/common/cache/Cache.module";
import { DatabaseModule } from "@/common/database/Database.module";
import { IntegrationEventsModule } from "@/common/events";
import { InboxAndOutbox1749299050551 } from "@/common/events/migrations/1749299050551-inbox-and-outbox";
import { InboxAndOutboxSequenceNumber1753291628862 } from "@/common/events/migrations/1753291628862-inbox-and-outbox-sequence-number";
import { InboxAndOutboxSplitTopicAndSubject1753291628863 } from "@/common/events/migrations/1753291628863-inbox-and-outbox-split-topic-and-subject";
import { TwoFactorAuthenticationIntegrationEntity } from "@/modules/identity/2fa/entities/TwoFactorAuthenticationIntegration.entity";
import { BaseAccountEntity } from "@/modules/identity/account/entities/BaseAccountEntity";
import { FederatedAccountEntity } from "@/modules/identity/account/entities/FederatedAccountEntity";
import { ManagedAccountEntity } from "@/modules/identity/account/entities/ManagedAccountEntity";
import { SingleUseTokenEntity } from "@/modules/identity/account/entities/SingleUseTokenEntity";
import { RefreshTokenEntity } from "@/modules/identity/authentication/entities/RefreshToken.entity";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";
import { RegenerateMigrations1749289911264 } from "@/modules/identity/infrastructure/database/migrations/1749289911264-regenerate-migrations";

@Module({
    imports: [
        CacheModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                connectionString: configService.getOrThrow<string>("modules.identity.cache.connectionString"),
            }),
            inject: [ConfigService],
        }),
        DatabaseModule.forRootAsync(IDENTITY_MODULE_DATA_SOURCE, {
            useFactory: (configService: ConfigService) => ({
                logging: configService.getOrThrow<boolean>("modules.identity.database.logging"),
                port: configService.getOrThrow<number>("modules.identity.database.port"),
                username: configService.getOrThrow<string>("modules.identity.database.username"),
                password: configService.getOrThrow<string>("modules.identity.database.password"),
                host: configService.getOrThrow<string>("modules.identity.database.host"),
                database: configService.getOrThrow<string>("modules.identity.database.name"),
                migrations: [
                    RegenerateMigrations1749289911264,
                    InboxAndOutbox1749299050551,
                    InboxAndOutboxSequenceNumber1753291628862,
                    InboxAndOutboxSplitTopicAndSubject1753291628863,
                ],
            }),
            inject: [ConfigService],
        }),
        DatabaseModule.forFeature(IDENTITY_MODULE_DATA_SOURCE, [
            RefreshTokenEntity,
            SingleUseTokenEntity,
            BaseAccountEntity,
            ManagedAccountEntity,
            FederatedAccountEntity,
            TwoFactorAuthenticationIntegrationEntity,
        ]),
        IntegrationEventsModule.forFeatureAsync({
            context: IdentitySharedModule.name,
            consumerGroupId: "identity",
            connectionName: IDENTITY_MODULE_DATA_SOURCE,
            useFactory: (configService: ConfigService) => ({
                inboxProcessorOptions: {
                    maxAttempts: configService.getOrThrow<number>("events.inbox.processing.maxAttempts"),
                    maxBatchSize: configService.getOrThrow<number>("events.inbox.processing.maxBatchSize"),
                },
                outboxProcessorOptions: {
                    maxAttempts: configService.getOrThrow<number>("events.outbox.processing.maxAttempts"),
                    maxBatchSize: configService.getOrThrow<number>("events.outbox.processing.maxBatchSize"),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    exports: [IntegrationEventsModule, DatabaseModule],
})
export class IdentitySharedModule {}
