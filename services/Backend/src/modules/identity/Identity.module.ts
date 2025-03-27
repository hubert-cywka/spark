import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DatabaseModule } from "@/common/database/Database.module";
import { IInboxEventHandler, InboxEventHandlersToken } from "@/common/events";
import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { AccountModule } from "@/modules/identity/account/Account.module";
import { BaseAccountEntity } from "@/modules/identity/account/entities/BaseAccountEntity";
import { FederatedAccountEntity } from "@/modules/identity/account/entities/FederatedAccountEntity";
import { ManagedAccountEntity } from "@/modules/identity/account/entities/ManagedAccountEntity";
import { SingleUseTokenEntity } from "@/modules/identity/account/entities/SingleUseTokenEntity";
import { AuthenticationModule } from "@/modules/identity/authentication/Authentication.module";
import { RefreshTokenEntity } from "@/modules/identity/authentication/entities/RefreshToken.entity";
import { AccountPasswordUpdatedEventHandler } from "@/modules/identity/authentication/events/AccountPasswordUpdatedEvent.handler";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";
import { InitializeIdentityModule1735737549567 } from "@/modules/identity/infrastructure/database/migrations/1735737549567-InitializeIdentityModule";
import { AddTenantIdToOutboxAndInbox1743101746907 } from "@/modules/identity/infrastructure/database/migrations/1743101746907-addTenantIdToOutboxAndInbox";
import { IdentitySharedModule } from "@/modules/identity/shared/IdentityShared.module";

@Module({
    providers: [
        {
            provide: InboxEventHandlersToken,
            useFactory: (...handlers: IInboxEventHandler[]) => handlers,
            inject: [AccountPasswordUpdatedEventHandler],
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
                    migrations: [InitializeIdentityModule1735737549567, AddTenantIdToOutboxAndInbox1743101746907],
                }),
                inject: [ConfigService],
            }
        ),
        IdentitySharedModule,
        AccountModule,
        AuthenticationModule,
    ],
    exports: [],
})
export class IdentityModule {}
