import { configDotenv } from "dotenv";
import { DataSource } from "typeorm";

import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { AppConfig } from "@/config/configuration";
import { BaseAccountEntity } from "@/modules/identity/account/entities/BaseAccountEntity";
import { FederatedAccountEntity } from "@/modules/identity/account/entities/FederatedAccountEntity";
import { ManagedAccountEntity } from "@/modules/identity/account/entities/ManagedAccountEntity";
import { SingleUseTokenEntity } from "@/modules/identity/account/entities/SingleUseTokenEntity";
import { RefreshTokenEntity } from "@/modules/identity/authentication/entities/RefreshToken.entity";

configDotenv();

const config = AppConfig();

export const dataSource = new DataSource({
    type: "postgres",
    port: parseInt(config.modules.auth.database.port ?? ""),
    host: config.modules.auth.database.host,
    username: config.modules.auth.database.username,
    password: config.modules.auth.database.password,
    database: config.modules.auth.database.name,
    synchronize: false,
    dropSchema: false,
    migrationsRun: false,
    entities: [
        OutboxEventEntity,
        RefreshTokenEntity,
        SingleUseTokenEntity,
        FederatedAccountEntity,
        ManagedAccountEntity,
        BaseAccountEntity,
    ],
    migrations: [],
});
