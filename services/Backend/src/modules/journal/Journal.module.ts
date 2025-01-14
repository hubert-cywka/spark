import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DatabaseModule } from "@/common/database/Database.module";
import { IInboxEventHandler, InboxEventHandlersToken } from "@/common/events";
import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { AuthorsModule } from "@/modules/journal/authors/Authors.module";
import { AuthorEntity } from "@/modules/journal/authors/entities/Author.entity";
import { AccountRegisteredEventHandler } from "@/modules/journal/authors/events/AccountRegisteredEvent.handler";
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
import { JournalSubscriber } from "@/modules/journal/Journal.subscriber";
import { JournalSharedModule } from "@/modules/journal/shared/JournalShared.module";

@Module({
    providers: [
        {
            provide: InboxEventHandlersToken,
            useFactory: (...handlers: IInboxEventHandler[]) => handlers,
            inject: [AccountRegisteredEventHandler],
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
    controllers: [JournalSubscriber],
})
export class JournalModule {}
