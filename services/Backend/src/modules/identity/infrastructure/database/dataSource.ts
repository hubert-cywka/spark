import { configDotenv } from "dotenv";
import { DataSource } from "typeorm";

import { AppConfig } from "@/config/configuration";
import { AccountEntity } from "@/modules/identity/account/entities/AccountEntity";
import { RefreshTokenEntity } from "@/modules/identity/authentication/entities/RefreshToken.entity";
import { InitIdentityModuleDatabase1729970567968 } from "@/modules/identity/infrastructure/database/migrations/1729970567968-InitIdentityModuleDatabase.ts";

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
    entities: [AccountEntity, RefreshTokenEntity],
    migrations: [InitIdentityModuleDatabase1729970567968],
});
