import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DatabaseModule } from "@/common/database/Database.module";
import { IntegrationEventsModule } from "@/common/events";
import { TwoFactorAuthenticationIntegrationEntity } from "@/modules/identity/2fa/entities/TwoFactorAuthenticationIntegration.entity";
import { BaseAccountEntity } from "@/modules/identity/account/entities/BaseAccountEntity";
import { FederatedAccountEntity } from "@/modules/identity/account/entities/FederatedAccountEntity";
import { ManagedAccountEntity } from "@/modules/identity/account/entities/ManagedAccountEntity";
import { SingleUseTokenEntity } from "@/modules/identity/account/entities/SingleUseTokenEntity";
import { RefreshTokenEntity } from "@/modules/identity/authentication/entities/RefreshToken.entity";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";
import { InitializeIdentityModule1735737549567 } from "@/modules/identity/infrastructure/database/migrations/1735737549567-InitializeIdentityModule";
import { AddTenantIdToOutboxAndInbox1743101746907 } from "@/modules/identity/infrastructure/database/migrations/1743101746907-addTenantIdToOutboxAndInbox";
import { DeleteOnCascade1743158756974 } from "@/modules/identity/infrastructure/database/migrations/1743158756974-deleteOnCascade";
import { AddOptionToSuspendAccounts1743167408668 } from "@/modules/identity/infrastructure/database/migrations/1743167408668-addOptionToSuspendAccounts";
import { AddTTLFor2FAIntegrations1743713719361 } from "@/modules/identity/infrastructure/database/migrations/1743713719361-addTTLFor2FAIntegrations";
import { EncryptedEvents1746293636231 } from "@/modules/identity/infrastructure/database/migrations/1746293636231-encryptedEvents";
import { AddProcessAfterTimestampToEvent1748202961809 } from "@/modules/identity/infrastructure/database/migrations/1748202961809-addProcessAfterTimestampToEvent";

@Module({
    imports: [
        DatabaseModule.forRootAsync(IDENTITY_MODULE_DATA_SOURCE, {
            useFactory: (configService: ConfigService) => ({
                logging: configService.getOrThrow<boolean>("modules.identity.database.logging"),
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
                    EncryptedEvents1746293636231,
                    AddProcessAfterTimestampToEvent1748202961809,
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
        IntegrationEventsModule.forFeature({
            context: IdentitySharedModule.name,
            consumerGroupId: "identity",
            connectionName: IDENTITY_MODULE_DATA_SOURCE,
        }),
    ],
    exports: [IntegrationEventsModule, DatabaseModule],
})
export class IdentitySharedModule {}
