import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerModule } from "@nestjs/throttler";

import { DatabaseModule } from "@/common/database/Database.module";
import { IInboxEventHandler, InboxEventHandlersToken, IntegrationEventsModule } from "@/common/events";
import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { ThrottlingGuard } from "@/common/guards/Throttling.guard";
import { AccountModule } from "@/modules/identity/account/Account.module";
import { BaseAccountEntity } from "@/modules/identity/account/entities/BaseAccountEntity";
import { FederatedAccountEntity } from "@/modules/identity/account/entities/FederatedAccountEntity";
import { ManagedAccountEntity } from "@/modules/identity/account/entities/ManagedAccountEntity";
import { SingleUseTokenEntity } from "@/modules/identity/account/entities/SingleUseTokenEntity";
import { AuthenticationModule } from "@/modules/identity/authentication/Authentication.module";
import { RefreshTokenEntity } from "@/modules/identity/authentication/entities/RefreshToken.entity";
import { AccountPasswordUpdatedEventHandler } from "@/modules/identity/authentication/events/AccountPasswordUpdatedEvent.handler";
import { AccessTokenStrategy } from "@/modules/identity/authentication/strategies/passport/AccessToken.strategy";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";
import { InitializeIdentityModule1735737549567 } from "@/modules/identity/infrastructure/database/migrations/1735737549567-InitializeIdentityModule";
import { IdentityEventBoxFactory } from "@/modules/identity/shared/services/IdentityEventBox.factory";

@Module({
    providers: [
        { provide: APP_GUARD, useClass: ThrottlingGuard },
        {
            provide: InboxEventHandlersToken,
            useFactory: (...handlers: IInboxEventHandler[]) => handlers,
            inject: [AccessTokenStrategy, AccountPasswordUpdatedEventHandler],
        },
    ],
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
            context: IdentityModule.name,
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
        AccountModule,
        AuthenticationModule,
    ],
    exports: [],
})
export class IdentityModule {}
