import { Inject, Module, OnModuleInit } from "@nestjs/common";

import { type IInboxEventHandler, InboxEventHandlersToken, IntegrationEventTopics } from "@/common/events";
import {
    type IIntegrationEventsJobsOrchestrator,
    IntegrationEventsJobsOrchestratorToken,
} from "@/common/events/services/interfaces/IIntegrationEventsJobsOrchestrator";
import {
    type IIntegrationEventsSubscriber,
    IntegrationEventsSubscriberToken,
} from "@/common/events/services/interfaces/IIntegrationEventsSubscriber";
import { AuthorsModule } from "@/modules/journal/authors/Authors.module";
import { AccountCreatedEventHandler } from "@/modules/journal/authors/events/AccountCreatedEvent.handler";
import { AuthorRemovedEventHandler } from "@/modules/journal/authors/events/AuthorRemovedEvent.handler";
import { DailyModule } from "@/modules/journal/daily/Daily.module";
import { EntriesModule } from "@/modules/journal/entries/Entries.module";
import { GoalsModule } from "@/modules/journal/goals/Goals.module";
import { JournalSharedModule } from "@/modules/journal/shared/JournalShared.module";

@Module({
    providers: [
        {
            provide: InboxEventHandlersToken,
            useFactory: (...handlers: IInboxEventHandler[]) => handlers,
            inject: [AccountCreatedEventHandler, AuthorRemovedEventHandler],
        },
    ],
    imports: [JournalSharedModule, AuthorsModule, DailyModule, GoalsModule, EntriesModule],
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

        void this.subscriber.listen([IntegrationEventTopics.account.created, IntegrationEventTopics.account.removal.completed]);
    }
}
