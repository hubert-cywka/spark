import { configDotenv } from "dotenv";
import { DataSource } from "typeorm";

import { AddActivationTokens1727179586288 } from "./migrations/1727179586288-AddActivationTokens";

import { RefreshTokenEntity } from "@/auth/entities/RefreshToken.entity";
import configuration from "@/config/configuration";
import { InitTables1726517504746 } from "@/database/migrations/1726517504746-InitTables";
import { UserEntity } from "@/user/entities/User.entity";

configDotenv();

const config = configuration();

export const dataSource = new DataSource({
    type: "postgres",
    port: parseInt(config.database.port ?? ""),
    host: config.database.host,
    username: config.database.username,
    password: config.database.password,
    database: config.database.name,
    synchronize: false,
    dropSchema: false,
    migrationsRun: false,
    entities: [UserEntity, RefreshTokenEntity],
    migrations: [InitTables1726517504746, AddActivationTokens1727179586288],
});
