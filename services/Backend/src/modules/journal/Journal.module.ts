import { Inject, Module, OnModuleInit } from "@nestjs/common";

import { type IInboxEventHandler, InboxEventHandlersToken, IntegrationEventStreams, IntegrationEventTopics } from "@/common/events";
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
        this.orchestrator.start(this.handlers);
        void this.subscriber.listen([
            {
                name: "codename_journal_account",
                stream: IntegrationEventStreams.account,
                subjects: [IntegrationEventTopics.account.created, IntegrationEventTopics.account.removal.completed],
            },
        ]);
    }
}
