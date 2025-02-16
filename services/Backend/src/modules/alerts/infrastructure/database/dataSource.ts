import { configDotenv } from "dotenv";
import { DataSource } from "typeorm";

import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { AppConfig } from "@/config/configuration";
import { AlertEntity } from "@/modules/alerts/entities/Alert.entity";
import { RecipientEntity } from "@/modules/alerts/entities/Recipient.entity";

configDotenv();

const config = AppConfig();

export const dataSource = new DataSource({
    type: "postgres",
    port: parseInt(config.modules.alerts.database.port ?? ""),
    host: config.modules.alerts.database.host,
    username: config.modules.alerts.database.username,
    password: config.modules.alerts.database.password,
    database: config.modules.alerts.database.name,
    synchronize: false,
    dropSchema: false,
    migrationsRun: false,
    entities: [OutboxEventEntity, InboxEventEntity, AlertEntity, RecipientEntity],
    migrations: [],
});
