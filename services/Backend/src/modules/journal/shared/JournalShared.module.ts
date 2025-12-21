import { Inject, Module, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { DatabaseModule } from "@/common/database/Database.module";
import { IntegrationEventsModule } from "@/common/events";
import { InboxAndOutbox1749299050551 } from "@/common/events/migrations/1749299050551-inbox-and-outbox";
import { InboxAndOutboxSequenceNumber1753291628862 } from "@/common/events/migrations/1753291628862-inbox-and-outbox-sequence-number";
import { InboxAndOutboxSplitTopicAndSubject1753291628863 } from "@/common/events/migrations/1753291628863-inbox-and-outbox-split-topic-and-subject";
import { HealthCheckModule } from "@/modules/healthcheck/HealthCheck.module";
import {
    type IHealthCheckProbesRegistry,
    HealthCheckProbesRegistryToken,
} from "@/modules/healthcheck/services/interfaces/IHealthCheckProbesRegistry";
import { AuthorEntity } from "@/modules/journal/authors/entities/Author.entity";
import { DailyEntity } from "@/modules/journal/daily/entities/Daily.entity";
import { EntryEntity } from "@/modules/journal/entries/entities/Entry.entity";
import { GoalEntity } from "@/modules/journal/goals/entities/Goal.entity";
import { JOURNAL_MODULE_DATA_SOURCE } from "@/modules/journal/infrastructure/database/constants";
import { RegenerateMigrations1749289925550 } from "@/modules/journal/infrastructure/database/migrations/1749289925550-regenerate-migrations";

@Module({
    providers: [],
    imports: [
        HealthCheckModule,
        DatabaseModule.forRootAsync(JOURNAL_MODULE_DATA_SOURCE, {
            useFactory: (configService: ConfigService) => ({
                logging: configService.getOrThrow<boolean>("modules.journal.database.logging"),
                port: configService.getOrThrow<number>("modules.journal.database.port"),
                username: configService.getOrThrow<string>("modules.journal.database.username"),
                password: configService.getOrThrow<string>("modules.journal.database.password"),
                host: configService.getOrThrow<string>("modules.journal.database.host"),
                database: configService.getOrThrow<string>("modules.journal.database.name"),
                migrations: [
                    RegenerateMigrations1749289925550,
                    InboxAndOutbox1749299050551,
                    InboxAndOutboxSequenceNumber1753291628862,
                    InboxAndOutboxSplitTopicAndSubject1753291628863,
                ],
            }),
            inject: [ConfigService],
        }),
        DatabaseModule.forFeature(JOURNAL_MODULE_DATA_SOURCE, [EntryEntity, DailyEntity, AuthorEntity, GoalEntity]),
        IntegrationEventsModule.forFeatureAsync({
            context: JournalSharedModule.name,
            consumerGroupId: "journal",
            connectionName: JOURNAL_MODULE_DATA_SOURCE,
            useFactory: (configService: ConfigService) => ({
                inboxProcessorOptions: {
                    maxAttempts: configService.getOrThrow<number>("events.inbox.processing.maxAttempts"),
                    maxBatchSize: configService.getOrThrow<number>("events.inbox.processing.maxBatchSize"),
                },
                outboxProcessorOptions: {
                    maxAttempts: configService.getOrThrow<number>("events.outbox.processing.maxAttempts"),
                    maxBatchSize: configService.getOrThrow<number>("events.outbox.processing.maxBatchSize"),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    exports: [IntegrationEventsModule, DatabaseModule],
})
export class JournalSharedModule implements OnModuleInit {
    constructor(
        @InjectDataSource(JOURNAL_MODULE_DATA_SOURCE)
        private readonly dataSource: DataSource,
        @Inject(HealthCheckProbesRegistryToken)
        private readonly healthCheckProbesService: IHealthCheckProbesRegistry
    ) {}

    onModuleInit() {
        this.healthCheckProbesService.registerDatabaseConnectionProbe(`database_${JOURNAL_MODULE_DATA_SOURCE}`, this.dataSource);
    }
}
