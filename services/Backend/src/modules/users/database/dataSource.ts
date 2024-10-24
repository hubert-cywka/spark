import { configDotenv } from "dotenv";
import { DataSource } from "typeorm";

import { AppConfig } from "@/config/configuration";
import { RefreshTokenEntity } from "@/modules/auth/entities/RefreshToken.entity";
import { UserEntity } from "@/modules/auth/entities/User.entity";

configDotenv();

const config = AppConfig();

export const dataSource = new DataSource({
    type: "postgres",
    port: parseInt(config.modules.users.database.port ?? ""),
    host: config.modules.users.database.host,
    username: config.modules.users.database.username,
    password: config.modules.users.database.password,
    database: config.modules.users.database.name,
    synchronize: false,
    dropSchema: false,
    migrationsRun: false,
    entities: [UserEntity, RefreshTokenEntity],
    migrations: [],
});
