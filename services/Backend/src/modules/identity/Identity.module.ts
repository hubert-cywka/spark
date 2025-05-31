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
import { AccountActivatedEventHandler } from "@/modules/identity/2fa/events/AccountActivatedEvent.handler";
import { TwoFactorAuthenticationModule } from "@/modules/identity/2fa/TwoFactorAuthentication.module";
import { AccountModule } from "@/modules/identity/account/Account.module";
import { AccountRemovalRequestedEventHandler } from "@/modules/identity/account/events/AccountRemovalRequestedEvent.handler";
import { AccountRemovedEventHandler } from "@/modules/identity/account/events/AccountRemovedEvent.handler";
import { AuthenticationModule } from "@/modules/identity/authentication/Authentication.module";
import { AccountPasswordUpdatedEventHandler } from "@/modules/identity/authentication/events/AccountPasswordUpdatedEvent.handler";
import { AccountSuspendedEventHandler } from "@/modules/identity/authentication/events/AccountSuspendedEvent.handler";
import { IdentitySharedModule } from "@/modules/identity/shared/IdentityShared.module";

@Module({
    providers: [
        {
            provide: InboxEventHandlersToken,
            useFactory: (...handlers: IInboxEventHandler[]) => handlers,
            inject: [
                AccountPasswordUpdatedEventHandler,
                AccountRemovedEventHandler,
                AccountSuspendedEventHandler,
                AccountRemovalRequestedEventHandler,
                AccountActivatedEventHandler,
            ],
        },
    ],
    imports: [IdentitySharedModule, AccountModule, AuthenticationModule, TwoFactorAuthenticationModule],
    controllers: [],
    exports: [],
})
export class IdentityModule implements OnModuleInit {
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
            IntegrationEventTopics.account.password.updated,
            IntegrationEventTopics.account.activation.completed,
            IntegrationEventTopics.account.removal.completed,
            IntegrationEventTopics.account.removal.requested,
            IntegrationEventTopics.account.suspended,
        ]);
    }
}
