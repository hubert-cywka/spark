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
import { type ITenantService, TenantServiceToken } from "@/modules/gdpr/services/interfaces/ITenant.service";

@Injectable()
export class TenantRemovedEventHandler implements IInboxEventHandler {
    public constructor(
        @Inject(TenantServiceToken)
        private readonly tenantService: ITenantService,
        @Inject(EventInboxToken)
        private readonly inbox: IEventInbox,
        @Inject(EventOutboxToken)
        private readonly outbox: IEventOutbox
    ) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.account.removal.completed;
    }

    async handle(event: IntegrationEvent): Promise<void> {
        const payload = (await event.getPayload()) as AccountRemovalCompletedEventPayload;
        await this.outbox.clearTenantEvents(payload.account.id);
        await this.tenantService.remove(payload.account.id);
        await this.inbox.clearTenantEvents(payload.account.id);
    }
}
