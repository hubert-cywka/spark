import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DatabaseModule } from "@/common/database/Database.module";
import { IntegrationEventsModule } from "@/common/events";
import { AuthorEntity } from "@/modules/journal/authors/entities/Author.entity";
import { DailyEntity } from "@/modules/journal/daily/entities/Daily.entity";
import { EntryEntity } from "@/modules/journal/entries/entities/Entry.entity";
import { GoalEntity } from "@/modules/journal/goals/entities/Goal.entity";
import { JOURNAL_MODULE_DATA_SOURCE } from "@/modules/journal/infrastructure/database/constants";
import { InitializeJournalModule1735835917869 } from "@/modules/journal/infrastructure/database/migrations/1735835917869-InitializeJournalModule";
import { AddDailyEntity1735843548123 } from "@/modules/journal/infrastructure/database/migrations/1735843548123-AddDailyEntity";
import { AddJournalAuthor1735844848384 } from "@/modules/journal/infrastructure/database/migrations/1735844848384-AddJournalAuthor";
import { AddAuthorIdColumnInDailyEntity1735994132208 } from "@/modules/journal/infrastructure/database/migrations/1735994132208-AddAuthorIdColumnInDailyEntity";
import { AddGoalsTable1736156638681 } from "@/modules/journal/infrastructure/database/migrations/1736156638681-AddGoalsTable";
import { DefaultValueForIsAccomplished1736157185323 } from "@/modules/journal/infrastructure/database/migrations/1736157185323-DefaultValueForIsAccomplished";
import { FixFK1736180535854 } from "@/modules/journal/infrastructure/database/migrations/1736180535854-FixFK";
import { AddGoalsTarget1736269181791 } from "@/modules/journal/infrastructure/database/migrations/1736269181791-AddGoalsTarget";
import { AddEntryEntity1736876093309 } from "@/modules/journal/infrastructure/database/migrations/1736876093309-AddEntryEntity";
import { AddIsCompletedFlagToEntries1737048686159 } from "@/modules/journal/infrastructure/database/migrations/1737048686159-AddIsCompletedFlagToEntries";
import { RenameJoinTableForGoalAndEntries1737103643312 } from "@/modules/journal/infrastructure/database/migrations/1737103643312-RenameJoinTableForGoalAndEntries";
import { AddIsFeaturedFlagToEntries1740304775599 } from "@/modules/journal/infrastructure/database/migrations/1740304775599-AddIsFeaturedFlagToEntries";
import { AddTenantIdToOutboxAndInbox1743101763604 } from "@/modules/journal/infrastructure/database/migrations/1743101763604-addTenantIdToOutboxAndInbox";
import { DeleteOnCascade1743158742983 } from "@/modules/journal/infrastructure/database/migrations/1743158742983-deleteOnCascade";
import { DeleteGoalsOnCascade1743159095911 } from "@/modules/journal/infrastructure/database/migrations/1743159095911-deleteGoalsOnCascade";
import { DeleteOnCascadeFix1743159586254 } from "@/modules/journal/infrastructure/database/migrations/1743159586254-deleteOnCascadeFix";
import { EncryptedEvents1746293695291 } from "@/modules/journal/infrastructure/database/migrations/1746293695291-encryptedEvents";
import { AddProcessAfterTimestampToEvent1748202970932 } from "@/modules/journal/infrastructure/database/migrations/1748202970932-addProcessAfterTimestampToEvent";
import { ImproveOutboxProcessing1748764641597 } from "@/modules/journal/infrastructure/database/migrations/1748764641597-ImproveOutboxProcessing";
import { Cleanup1748765396554 } from "@/modules/journal/infrastructure/database/migrations/1748765396554-Cleanup";
import { OutboxIndices1748773002756 } from "@/modules/journal/infrastructure/database/migrations/1748773002756-OutboxIndices";

@Module({
    providers: [],
    imports: [
        DatabaseModule.forRootAsync(JOURNAL_MODULE_DATA_SOURCE, {
            useFactory: (configService: ConfigService) => ({
                logging: configService.getOrThrow<boolean>("modules.journal.database.logging"),
                port: configService.getOrThrow<number>("modules.journal.database.port"),
                username: configService.getOrThrow<string>("modules.journal.database.username"),
                password: configService.getOrThrow<string>("modules.journal.database.password"),
                host: configService.getOrThrow<string>("modules.journal.database.host"),
                database: configService.getOrThrow<string>("modules.journal.database.name"),
                migrations: [
                    InitializeJournalModule1735835917869,
                    AddDailyEntity1735843548123,
                    AddJournalAuthor1735844848384,
                    AddAuthorIdColumnInDailyEntity1735994132208,
                    AddGoalsTable1736156638681,
                    DefaultValueForIsAccomplished1736157185323,
                    FixFK1736180535854,
                    AddGoalsTarget1736269181791,
                    AddEntryEntity1736876093309,
                    AddIsCompletedFlagToEntries1737048686159,
                    RenameJoinTableForGoalAndEntries1737103643312,
                    AddIsFeaturedFlagToEntries1740304775599,
                    AddTenantIdToOutboxAndInbox1743101763604,
                    DeleteOnCascade1743158742983,
                    DeleteGoalsOnCascade1743159095911,
                    DeleteOnCascadeFix1743159586254,
                    EncryptedEvents1746293695291,
                    AddProcessAfterTimestampToEvent1748202970932,
                    ImproveOutboxProcessing1748764641597,
                    Cleanup1748765396554,
                    OutboxIndices1748773002756,
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
export class JournalSharedModule {}
