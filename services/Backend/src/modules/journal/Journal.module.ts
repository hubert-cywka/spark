import { Inject, Module, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DatabaseModule } from "@/common/database/Database.module";
import { type IInboxEventHandler, InboxEventHandlersToken, IntegrationEventStreams, IntegrationEventTopics } from "@/common/events";
import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import {
    type IIntegrationEventsJobsOrchestrator,
    IntegrationEventsJobsOrchestratorToken,
} from "@/common/events/services/interfaces/IIntegrationEventsJobsOrchestrator";
import {
    type IIntegrationEventsSubscriber,
    IntegrationEventsSubscriberToken,
} from "@/common/events/services/interfaces/IIntegrationEventsSubscriber";
import { AuthorsModule } from "@/modules/journal/authors/Authors.module";
import { AuthorEntity } from "@/modules/journal/authors/entities/Author.entity";
import { AccountRegisteredEventHandler } from "@/modules/journal/authors/events/AccountRegisteredEvent.handler";
import { AuthorRemovedEventHandler } from "@/modules/journal/authors/events/AuthorRemovedEvent.handler";
import { DailyModule } from "@/modules/journal/daily/Daily.module";
import { DailyEntity } from "@/modules/journal/daily/entities/Daily.entity";
import { EntryEntity } from "@/modules/journal/entries/entities/Entry.entity";
import { EntriesModule } from "@/modules/journal/entries/Entries.module";
import { GoalEntity } from "@/modules/journal/goals/entities/Goal.entity";
import { GoalsModule } from "@/modules/journal/goals/Goals.module";
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
import { JournalSharedModule } from "@/modules/journal/shared/JournalShared.module";

@Module({
    providers: [
        {
            provide: InboxEventHandlersToken,
            useFactory: (...handlers: IInboxEventHandler[]) => handlers,
            inject: [AccountRegisteredEventHandler, AuthorRemovedEventHandler],
        },
    ],
    imports: [
        DatabaseModule.forRootAsync(
            JOURNAL_MODULE_DATA_SOURCE,
            [OutboxEventEntity, InboxEventEntity, EntryEntity, DailyEntity, AuthorEntity, GoalEntity],
            {
                useFactory: (configService: ConfigService) => ({
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
                    ],
                }),
                inject: [ConfigService],
            }
        ),
        JournalSharedModule,
        AuthorsModule,
        DailyModule,
        GoalsModule,
        EntriesModule,
    ],
    controllers: [],
})
export class JournalModule implements OnModuleInit {
    public constructor(
        @Inject(IntegrationEventsSubscriberToken)
        private readonly subscriber: IIntegrationEventsSubscriber,
        @Inject(IntegrationEventsJobsOrchestratorToken)
        private readonly orchestrator: IIntegrationEventsJobsOrchestrator,
        @Inject(InboxEventHandlersToken)
        private readonly handlers: IInboxEventHandler[]
    ) {}

    public onModuleInit() {
        this.orchestrator.start(this.handlers);
        void this.subscriber.listen([
            {
                name: "codename_journal_account",
                stream: IntegrationEventStreams.account,
                subjects: [IntegrationEventTopics.account.registration.completed, IntegrationEventTopics.account.removal.completed],
            },
        ]);
    }
}
