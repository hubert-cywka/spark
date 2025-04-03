import { configDotenv } from "dotenv";
import { DataSource } from "typeorm";

import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { AppConfig } from "@/config/configuration";
import { TwoFactorAuthenticationOptionEntity } from "@/modules/identity/2fa/entities/TwoFactorAuthenticationOption.entity";
import { BaseAccountEntity } from "@/modules/identity/account/entities/BaseAccountEntity";
import { FederatedAccountEntity } from "@/modules/identity/account/entities/FederatedAccountEntity";
import { ManagedAccountEntity } from "@/modules/identity/account/entities/ManagedAccountEntity";
import { SingleUseTokenEntity } from "@/modules/identity/account/entities/SingleUseTokenEntity";
import { RefreshTokenEntity } from "@/modules/identity/authentication/entities/RefreshToken.entity";

configDotenv();

const config = AppConfig();

export const dataSource = new DataSource({
    type: "postgres",
    port: parseInt(config.modules.identity.database.port ?? ""),
    host: config.modules.identity.database.host,
    username: config.modules.identity.database.username,
    password: config.modules.identity.database.password,
    database: config.modules.identity.database.name,
    synchronize: false,
    dropSchema: false,
    migrationsRun: false,
    entities: [
        OutboxEventEntity,
        InboxEventEntity,
        RefreshTokenEntity,
        SingleUseTokenEntity,
        FederatedAccountEntity,
        ManagedAccountEntity,
        BaseAccountEntity,
        TwoFactorAuthenticationOptionEntity,
    ],
    migrations: [],
});
