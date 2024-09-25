import { configDotenv } from "dotenv";
import { DataSource } from "typeorm";

import configuration from "@/common/config/configuration";
import { AddUserTable1727272270150 } from "@/database/migrations/1727272270150-AddUserTable";
import { UserEntity } from "@/users/entities/User.entity";

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
    entities: [UserEntity],
    migrations: [AddUserTable1727272270150],
});
