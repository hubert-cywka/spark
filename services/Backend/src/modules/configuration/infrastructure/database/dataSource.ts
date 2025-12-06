import { configDotenv } from "dotenv";
import { DataSource } from "typeorm";

import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { InboxEventPartitionEntity } from "@/common/events/entities/InboxEventPartition.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { OutboxEventPartitionEntity } from "@/common/events/entities/OutboxEventPartition.entity";
import { AppConfig } from "@/config/configuration";
import {TenantEntity} from "@/modules/configuration/entities/Tenant.entity";

configDotenv();

const config = AppConfig();

export const dataSource = new DataSource({
    type: "postgres",
    port: parseInt(config.modules.configuration.database.port ?? ""),
    host: config.modules.configuration.database.host,
    username: config.modules.configuration.database.username,
    password: config.modules.configuration.database.password,
    database: config.modules.configuration.database.name,
    synchronize: false,
    dropSchema: false,
    migrationsRun: false,
    entities: [
        OutboxEventEntity,
        InboxEventEntity,
        OutboxEventPartitionEntity,
        InboxEventPartitionEntity,
        TenantEntity
    ],
    migrations: [],
});
