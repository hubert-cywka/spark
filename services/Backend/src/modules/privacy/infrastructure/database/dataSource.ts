import { configDotenv } from "dotenv";
import { DataSource } from "typeorm";

import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { InboxEventPartitionEntity } from "@/common/events/entities/InboxEventPartition.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { OutboxEventPartitionEntity } from "@/common/events/entities/OutboxEventPartition.entity";
import { AppConfig } from "@/config/configuration";
import { DataPurgePlanEntity } from "@/modules/privacy/entities/DataPurgePlan.entity";
import { TenantEntity } from "@/modules/privacy/entities/Tenant.entity";

configDotenv();

const config = AppConfig();

export const dataSource = new DataSource({
    type: "postgres",
    port: parseInt(config.modules.privacy.database.port ?? ""),
    host: config.modules.privacy.database.host,
    username: config.modules.privacy.database.username,
    password: config.modules.privacy.database.password,
    database: config.modules.privacy.database.name,
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
