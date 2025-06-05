import { configDotenv } from "dotenv";
import { DataSource } from "typeorm";

import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { InboxEventPartitionEntity } from "@/common/events/entities/InboxEventPartition.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { OutboxEventPartitionEntity } from "@/common/events/entities/OutboxEventPartition.entity";
import { AppConfig } from "@/config/configuration";
import { DataPurgePlanEntity } from "@/modules/gdpr/entities/DataPurgePlan.entity";
import { TenantEntity } from "@/modules/gdpr/entities/Tenant.entity";

configDotenv();

const config = AppConfig();

export const dataSource = new DataSource({
    type: "postgres",
    port: parseInt(config.modules.gdpr.database.port ?? ""),
    host: config.modules.gdpr.database.host,
    username: config.modules.gdpr.database.username,
    password: config.modules.gdpr.database.password,
    database: config.modules.gdpr.database.name,
    synchronize: false,
    dropSchema: false,
    migrationsRun: false,
    entities: [
        OutboxEventEntity,
        InboxEventEntity,
        TenantEntity,
        DataPurgePlanEntity,
        OutboxEventPartitionEntity,
        InboxEventPartitionEntity,
    ],
    migrations: [],
});
