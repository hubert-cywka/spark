import { configDotenv } from "dotenv";
import { DataSource } from "typeorm";

import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { InboxEventPartitionEntity } from "@/common/events/entities/InboxEventPartition.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { OutboxEventPartitionEntity } from "@/common/events/entities/OutboxEventPartition.entity";
import { AppConfig } from "@/config/configuration";
import { JobExecutionEntity } from "@/modules/scheduling/entities/JobExecution.entity";
import { JobScheduleEntity } from "@/modules/scheduling/entities/JobScheduleEntity";

configDotenv();

const config = AppConfig();

export const dataSource = new DataSource({
    type: "postgres",
    port: parseInt(config.modules.scheduling.database.port ?? ""),
    host: config.modules.scheduling.database.host,
    username: config.modules.scheduling.database.username,
    password: config.modules.scheduling.database.password,
    database: config.modules.scheduling.database.name,
    synchronize: false,
    dropSchema: false,
    migrationsRun: false,
    entities: [
        OutboxEventEntity,
        InboxEventEntity,
        OutboxEventPartitionEntity,
        InboxEventPartitionEntity,
        JobScheduleEntity,
        JobExecutionEntity,
    ],
    migrations: [],
});
