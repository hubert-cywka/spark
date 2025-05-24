import { Inject, Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";

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
import { MAIL_MODULE_DATA_SOURCE } from "@/modules/mail/infrastructure/database/constants";
import { type IRecipientService, RecipientServiceToken } from "@/modules/mail/services/interfaces/IRecipient.service";

@Injectable()
export class AccountRemovedEventHandler implements IInboxEventHandler {
    public constructor(
        @Inject(RecipientServiceToken)
        private recipientService: IRecipientService,
        @Inject(EventInboxToken)
        private readonly inbox: IEventInbox,
        @Inject(EventOutboxToken)
        private readonly outbox: IEventOutbox
    ) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.account.removal.completed;
    }

    @Transactional({ connectionName: MAIL_MODULE_DATA_SOURCE })
    async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountRemovalCompletedEventPayload;
        await this.outbox.clearTenantEvents(payload.account.id);
        await this.inbox.clearTenantEvents(payload.account.id);
        await this.recipientService.remove(payload.account.id);
    }
}
