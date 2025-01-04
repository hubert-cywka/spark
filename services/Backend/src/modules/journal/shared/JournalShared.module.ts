import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DatabaseModule } from "@/common/database/Database.module";
import { IntegrationEventsModule } from "@/common/events";
import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { AuthorEntity } from "@/modules/journal/author/entities/Author.entity";
import { DailyEntity } from "@/modules/journal/daily/entities/Daily.entity";
import { JournalEventBoxFactory } from "@/modules/journal/daily/services/implementations/JournalEventBox.factory";
import { JOURNAL_MODULE_DATA_SOURCE } from "@/modules/journal/infrastructure/database/constants";
import { InitializeJournalModule1735835917869 } from "@/modules/journal/infrastructure/database/migrations/1735835917869-InitializeJournalModule";
import { AddDailyEntity1735843548123 } from "@/modules/journal/infrastructure/database/migrations/1735843548123-AddDailyEntity";
import { AddJournalAuthor1735844848384 } from "@/modules/journal/infrastructure/database/migrations/1735844848384-AddJournalAuthor";
import { AddAuthorIdColumnInDailyEntity1735994132208 } from "@/modules/journal/infrastructure/database/migrations/1735994132208-AddAuthorIdColumnInDailyEntity";

@Module({
    providers: [],
    imports: [
        DatabaseModule.forRootAsync(JOURNAL_MODULE_DATA_SOURCE, [OutboxEventEntity, InboxEventEntity, DailyEntity, AuthorEntity], {
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
                ],
            }),
            inject: [ConfigService],
        }),
        IntegrationEventsModule.forFeature({
            eventBoxFactoryClass: JournalEventBoxFactory,
            context: JournalSharedModule.name,
        }),
    ],
    exports: [IntegrationEventsModule, DatabaseModule],
})
export class JournalSharedModule {}
