import { configDotenv } from "dotenv";
import { DataSource } from "typeorm";

import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { AppConfig } from "@/config/configuration";

configDotenv();

const config = AppConfig();

export const dataSource = new DataSource({
    type: "postgres",
    port: parseInt(config.modules.journal.database.port ?? ""),
    host: config.modules.journal.database.host,
    username: config.modules.journal.database.username,
    password: config.modules.journal.database.password,
    database: config.modules.journal.database.name,
    synchronize: false,
    dropSchema: false,
    migrationsRun: false,
    entities: [OutboxEventEntity, InboxEventEntity],
    migrations: [],
});
