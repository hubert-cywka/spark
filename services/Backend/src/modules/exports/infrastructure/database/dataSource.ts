import { configDotenv } from "dotenv";
import { DataSource } from "typeorm";

import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { InboxEventPartitionEntity } from "@/common/events/entities/InboxEventPartition.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { OutboxEventPartitionEntity } from "@/common/events/entities/OutboxEventPartition.entity";
import { AppConfig } from "@/config/configuration";
import { DataExportEntity } from "@/modules/exports/entities/DataExport.entity";
import { ExportAttachmentManifestEntity } from "@/modules/exports/entities/ExportAttachmentManifest.entity";
import { TenantEntity } from "@/modules/exports/entities/Tenant.entity";

configDotenv();

const config = AppConfig();

export const dataSource = new DataSource({
    type: "postgres",
    port: parseInt(config.modules.exports.database.port ?? ""),
    host: config.modules.exports.database.host,
    username: config.modules.exports.database.username,
    password: config.modules.exports.database.password,
    database: config.modules.exports.database.name,
    synchronize: false,
    dropSchema: false,
    migrationsRun: false,
    entities: [
        OutboxEventEntity,
        InboxEventEntity,
        OutboxEventPartitionEntity,
        InboxEventPartitionEntity,
        TenantEntity,
        DataExportEntity,
        ExportAttachmentManifestEntity,
    ],
    migrations: [],
});
