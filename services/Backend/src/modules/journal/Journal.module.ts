import { Inject, Module, OnModuleInit } from "@nestjs/common";

import { type IInboxEventHandler, InboxEventHandlersToken, IntegrationEvents } from "@/common/events";
import {
    type IIntegrationEventsJobsOrchestrator,
    IntegrationEventsJobsOrchestratorToken,
} from "@/common/events/services/interfaces/IIntegrationEventsJobsOrchestrator";
import {
    type IIntegrationEventsSubscriber,
    IntegrationEventsSubscriberToken,
} from "@/common/events/services/interfaces/IIntegrationEventsSubscriber";
import { ExportsModule } from "@/modules/exports/Exports.module";
import { AuthorsModule } from "@/modules/journal/authors/Authors.module";
import { AccountCreatedEventHandler } from "@/modules/journal/authors/events/AccountCreatedEvent.handler";
import { AuthorRemovedEventHandler } from "@/modules/journal/authors/events/AuthorRemovedEvent.handler";
import { DailyModule } from "@/modules/journal/daily/Daily.module";
import { EntriesModule } from "@/modules/journal/entries/Entries.module";
import { EntriesDataExportProvider } from "@/modules/journal/entries/services/implementations/EntriesDataExportProvider";
import { GoalsModule } from "@/modules/journal/goals/Goals.module";
import { GoalsDataExportProvider } from "@/modules/journal/goals/services/implementations/GoalsDataExportProvider";
import { JOURNAL_MODULE_DATA_SOURCE } from "@/modules/journal/infrastructure/database/constants";
import { JournalSharedModule } from "@/modules/journal/shared/JournalShared.module";

@Module({
    providers: [
        {
            provide: InboxEventHandlersToken,
            useFactory: (...handlers: IInboxEventHandler[]) => handlers,
            inject: [AccountCreatedEventHandler, AuthorRemovedEventHandler, ...ExportsModule.getEventHandlersForExporter()],
        },
    ],
    imports: [
        JournalSharedModule,
        AuthorsModule,
        DailyModule,
        GoalsModule,
        EntriesModule,
        ExportsModule.forFeature({
            connectionName: JOURNAL_MODULE_DATA_SOURCE,
            providers: [EntriesDataExportProvider, GoalsDataExportProvider],
            imports: [EntriesModule, GoalsModule, JournalSharedModule],
        }),
    ],
    exports: [],
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
        this.orchestrator.startProcessingInbox(this.handlers);
        this.orchestrator.startProcessingOutbox();
        this.orchestrator.startClearingInbox();
        this.orchestrator.startClearingOutbox();

        void this.subscriber.listen([
            IntegrationEvents.account.created,
            IntegrationEvents.account.removal.completed,
            ...ExportsModule.getEventTopicsForExporter(),
        ]);
    }
}
