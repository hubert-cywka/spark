import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DatabaseModule } from "@/common/database/Database.module";
import { IInboxEventHandler, InboxEventHandlersToken } from "@/common/events";
import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { TwoFactorAuthenticationIntegrationEntity } from "@/modules/identity/2fa/entities/TwoFactorAuthenticationIntegration.entity";
import { AccountActivatedEventHandler } from "@/modules/identity/2fa/events/AccountActivatedEvent.handler";
import { TwoFactorAuthenticationModule } from "@/modules/identity/2fa/TwoFactorAuthentication.module";
import { AccountModule } from "@/modules/identity/account/Account.module";
import { BaseAccountEntity } from "@/modules/identity/account/entities/BaseAccountEntity";
import { FederatedAccountEntity } from "@/modules/identity/account/entities/FederatedAccountEntity";
import { ManagedAccountEntity } from "@/modules/identity/account/entities/ManagedAccountEntity";
import { SingleUseTokenEntity } from "@/modules/identity/account/entities/SingleUseTokenEntity";
import { AccountRemovalRequestedEventHandler } from "@/modules/identity/account/events/AccountRemovalRequestedEvent.handler";
import { AccountRemovedEventHandler } from "@/modules/identity/account/events/AccountRemovedEvent.handler";
import { AuthenticationModule } from "@/modules/identity/authentication/Authentication.module";
import { RefreshTokenEntity } from "@/modules/identity/authentication/entities/RefreshToken.entity";
import { AccountPasswordUpdatedEventHandler } from "@/modules/identity/authentication/events/AccountPasswordUpdatedEvent.handler";
import { AccountSuspendedEventHandler } from "@/modules/identity/authentication/events/AccountSuspendedEvent.handler";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";
import { InitializeIdentityModule1735737549567 } from "@/modules/identity/infrastructure/database/migrations/1735737549567-InitializeIdentityModule";
import { AddTenantIdToOutboxAndInbox1743101746907 } from "@/modules/identity/infrastructure/database/migrations/1743101746907-addTenantIdToOutboxAndInbox";
import { DeleteOnCascade1743158756974 } from "@/modules/identity/infrastructure/database/migrations/1743158756974-deleteOnCascade";
import { AddOptionToSuspendAccounts1743167408668 } from "@/modules/identity/infrastructure/database/migrations/1743167408668-addOptionToSuspendAccounts";
import { AddTTLFor2FAIntegrations1743713719361 } from "@/modules/identity/infrastructure/database/migrations/1743713719361-addTTLFor2FAIntegrations";
import { IdentitySharedModule } from "@/modules/identity/shared/IdentityShared.module";

@Module({
    providers: [
        {
            provide: InboxEventHandlersToken,
            useFactory: (...handlers: IInboxEventHandler[]) => handlers,
            inject: [
                AccountPasswordUpdatedEventHandler,
                AccountRemovedEventHandler,
                AccountSuspendedEventHandler,
                AccountRemovalRequestedEventHandler,
                AccountActivatedEventHandler,
            ],
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
                TwoFactorAuthenticationIntegrationEntity,
            ],
            {
                useFactory: (configService: ConfigService) => ({
                    port: configService.getOrThrow<number>("modules.identity.database.port"),
                    username: configService.getOrThrow<string>("modules.identity.database.username"),
                    password: configService.getOrThrow<string>("modules.identity.database.password"),
                    host: configService.getOrThrow<string>("modules.identity.database.host"),
                    database: configService.getOrThrow<string>("modules.identity.database.name"),
                    migrations: [
                        InitializeIdentityModule1735737549567,
                        AddTenantIdToOutboxAndInbox1743101746907,
                        DeleteOnCascade1743158756974,
                        AddOptionToSuspendAccounts1743167408668,
                        AddTTLFor2FAIntegrations1743713719361,
                    ],
                }),
                inject: [ConfigService],
            }
        ),
        IdentitySharedModule,
        AccountModule,
        AuthenticationModule,
        TwoFactorAuthenticationModule,
    ],
    controllers: [],
    exports: [],
})
export class IdentityModule {}
