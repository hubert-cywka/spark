import { configDotenv } from "dotenv";
import { DataSource } from "typeorm";

import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { AppConfig } from "@/config/configuration";
import { UserEntity } from "@/modules/users/entities/User.entity";

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
    entities: [UserEntity, OutboxEventEntity, InboxEventEntity],
    migrations: [],
});
