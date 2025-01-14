import { configDotenv } from "dotenv";
import { DataSource } from "typeorm";

import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { AppConfig } from "@/config/configuration";
import { AuthorEntity } from "@/modules/journal/authors/entities/Author.entity";
import { DailyEntity } from "@/modules/journal/daily/entities/Daily.entity";
import { EntryEntity } from "@/modules/journal/entries/entities/Entry.entity";
import { GoalEntity } from "@/modules/journal/goals/entities/Goal.entity";

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
    entities: [OutboxEventEntity, InboxEventEntity, DailyEntity, AuthorEntity, GoalEntity, EntryEntity],
    migrations: [],
});
