import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DatabaseModule } from "@/common/database/Database.module";
import { IInboxEventHandler, InboxEventHandlersToken, IntegrationEventsModule } from "@/common/events";
import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { JOURNAL_MODULE_DATA_SOURCE } from "@/modules/journal/infrastructure/constants";
import { InitializeJournalModule1735835917869 } from "@/modules/journal/infrastructure/database/migrations/1735835917869-InitializeJournalModule";
import { JournalEventBoxFactory } from "@/modules/journal/services/implementations/JournalEventBox.factory";

@Module({
    providers: [
        {
            provide: InboxEventHandlersToken,
            useFactory: (...handlers: IInboxEventHandler[]) => handlers,
            inject: [],
        },
    ],
    imports: [
        DatabaseModule.forRootAsync(JOURNAL_MODULE_DATA_SOURCE, [OutboxEventEntity, InboxEventEntity], {
            useFactory: (configService: ConfigService) => ({
                port: configService.getOrThrow<number>("modules.journal.database.port"),
                username: configService.getOrThrow<string>("modules.journal.database.username"),
                password: configService.getOrThrow<string>("modules.journal.database.password"),
                host: configService.getOrThrow<string>("modules.journal.database.host"),
                database: configService.getOrThrow<string>("modules.journal.database.name"),
                migrations: [InitializeJournalModule1735835917869],
            }),
            inject: [ConfigService],
        }),
        IntegrationEventsModule.forFeature({
            eventBoxFactoryClass: JournalEventBoxFactory,
            context: JournalModule.name,
        }),
    ],
    controllers: [],
})
export class JournalModule {}
