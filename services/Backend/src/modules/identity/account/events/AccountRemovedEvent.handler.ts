import { Inject, Injectable } from "@nestjs/common";

import {
    type IEventInbox,
    type IEventOutbox,
    type IInboxEventHandler,
    EventInboxToken,
    EventOutboxToken,
    IntegrationEvent,
    IntegrationEventTopics,
} from "@/common/events";
import { type AccountRemovalCompletedEventPayload } from "@/common/events/types/account/AccountRemovalCompletedEvent";
import {
    type IFederatedAccountService,
    FederatedAccountServiceToken,
} from "@/modules/identity/account/services/interfaces/IFederatedAccount.service";
import {
    type IManagedAccountService,
    ManagedAccountServiceToken,
} from "@/modules/identity/account/services/interfaces/IManagedAccount.service";

@Injectable()
export class AccountRemovedEventHandler implements IInboxEventHandler {
    public constructor(
        @Inject(FederatedAccountServiceToken)
        private readonly federatedAccountService: IFederatedAccountService,
        @Inject(ManagedAccountServiceToken)
        private readonly managedAccountService: IManagedAccountService,
        @Inject(EventInboxToken)
        private readonly inbox: IEventInbox,
        @Inject(EventOutboxToken)
        private readonly outbox: IEventOutbox
    ) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.account.removal.completed;
    }

    async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountRemovalCompletedEventPayload;
        await this.outbox.clearTenantEvents(payload.account.id);
        await this.federatedAccountService.removeByInternalId(payload.account.id);
        await this.managedAccountService.removeByInternalId(payload.account.id);
        await this.inbox.clearTenantEvents(payload.account.id);
    }
}
