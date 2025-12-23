import { Inject, Injectable } from "@nestjs/common";

import { EventPublisherToken } from "@/common/events/services/interfaces/IEventPublisher";
import { type IEventPublisher } from "@/common/events/services/interfaces/IEventPublisher";
import {
    AccountRemovalCompletedEvent,
    AccountRemovalCompletedEventPayload,
} from "@/common/events/types/account/AccountRemovalCompletedEvent";
import {
    AccountRemovalScheduledEvent,
    AccountRemovalScheduledEventPayload,
} from "@/common/events/types/account/AccountRemovalScheduledEvent";
import { type IDataPurgeEventsPublisher } from "@/modules/gdpr/services/interfaces/IDataPurgeEventsPublisher";

@Injectable()
export class DataPurgeEventsPublisher implements IDataPurgeEventsPublisher {
    public constructor(
        @Inject(EventPublisherToken)
        private readonly publisher: IEventPublisher
    ) {}

    public async onPurgePlanProcessed(tenantId: string, payload: AccountRemovalCompletedEventPayload): Promise<void> {
        await this.publisher.enqueue(new AccountRemovalCompletedEvent(tenantId, payload));
    }

    public async onPurgePlanScheduled(tenantId: string, payload: AccountRemovalScheduledEventPayload): Promise<void> {
        await this.publisher.enqueue(new AccountRemovalScheduledEvent(tenantId, payload));
    }
}
