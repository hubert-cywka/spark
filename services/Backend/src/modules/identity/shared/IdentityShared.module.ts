import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";

import { DatabaseModule } from "@/common/database/Database.module";
import { IntegrationEventsModule } from "@/common/events";
import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { BaseAccountEntity } from "@/modules/identity/account/entities/BaseAccountEntity";
import { FederatedAccountEntity } from "@/modules/identity/account/entities/FederatedAccountEntity";
import { ManagedAccountEntity } from "@/modules/identity/account/entities/ManagedAccountEntity";
import { SingleUseTokenEntity } from "@/modules/identity/account/entities/SingleUseTokenEntity";
import { RefreshTokenEntity } from "@/modules/identity/authentication/entities/RefreshToken.entity";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";
import { InitializeIdentityModule1735737549567 } from "@/modules/identity/infrastructure/database/migrations/1735737549567-InitializeIdentityModule";
import { IdentityEventBoxFactory } from "@/modules/identity/shared/services/IdentityEventBox.factory";

@Module({
    imports: [
        DatabaseModule.forRootAsync(
            IDENTITY_MODULE_DATA_SOURCE,
            [
                RefreshTokenEntity,
                SingleUseTokenEntity,
                BaseAccountEntity,
                ManagedAccountEntity,
                FederatedAccountEntity,
                OutboxEventEntity,
                InboxEventEntity,
            ],
            {
                useFactory: (configService: ConfigService) => ({
                    port: configService.getOrThrow<number>("modules.identity.database.port"),
                    username: configService.getOrThrow<string>("modules.identity.database.username"),
                    password: configService.getOrThrow<string>("modules.identity.database.password"),
                    host: configService.getOrThrow<string>("modules.identity.database.host"),
                    database: configService.getOrThrow<string>("modules.identity.database.name"),
                    migrations: [InitializeIdentityModule1735737549567],
                }),
                inject: [ConfigService],
            }
        ),
        IntegrationEventsModule.forFeature({
            eventBoxFactoryClass: IdentityEventBoxFactory,
            context: IdentitySharedModule.name,
        }),
        ThrottlerModule.forRootAsync({
            useFactory: (configService: ConfigService) => [
                {
                    ttl: configService.getOrThrow<number>("modules.identity.throttle.ttl"),
                    limit: configService.getOrThrow<number>("modules.identity.throttle.limit"),
                },
            ],
            inject: [ConfigService],
        }),
    ],
    exports: [IntegrationEventsModule, ThrottlerModule, DatabaseModule],
})
export class IdentitySharedModule {}
