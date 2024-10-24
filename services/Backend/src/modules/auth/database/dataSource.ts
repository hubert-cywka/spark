import { configDotenv } from "dotenv";
import { DataSource } from "typeorm";

import { AppConfig } from "@/config/configuration";
import { RefreshTokenEntity } from "@/modules/auth/entities/RefreshToken.entity";
import { UserEntity } from "@/modules/auth/entities/User.entity";

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
    entities: [UserEntity, RefreshTokenEntity],
    migrations: [],
});
