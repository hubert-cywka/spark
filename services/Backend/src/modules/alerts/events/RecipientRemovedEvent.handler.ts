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
import { type IRecipientService, RecipientServiceToken } from "@/modules/alerts/services/interfaces/IRecipient.service";

@Injectable()
export class RecipientRemovedEventHandler implements IInboxEventHandler {
    public constructor(
        @Inject(RecipientServiceToken)
        private readonly recipientService: IRecipientService,
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
        await this.recipientService.remove(payload.account.id);
        await this.inbox.clearTenantEvents(payload.account.id);
    }
}
