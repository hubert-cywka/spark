import { Inject, Injectable } from "@nestjs/common";

import { EventOutboxToken } from "@/common/events/services/interfaces/IEventOutbox";
import { type IEventOutbox } from "@/common/events/services/interfaces/IEventOutbox";
import {
    AccountRemovalCompletedEvent,
    AccountRemovalCompletedEventPayload,
} from "@/common/events/types/account/AccountRemovalCompletedEvent";
import {
    AccountRemovalScheduledEvent,
    AccountRemovalScheduledEventPayload,
} from "@/common/events/types/account/AccountRemovalScheduledEvent";
import { type IDataPurgeEventsPublisher } from "@/modules/gdpr/services/interfaces/IDataPurgeEventsPublisher.service";

@Injectable()
export class DataPurgeEventsPublisher implements IDataPurgeEventsPublisher {
    public constructor(
        @Inject(EventOutboxToken)
        private readonly outbox: IEventOutbox
    ) {}

    public async onPurgePlanProcessed(tenantId: string, payload: AccountRemovalCompletedEventPayload): Promise<void> {
        await this.outbox.enqueue(new AccountRemovalCompletedEvent(tenantId, payload));
    }

    public async onPurgePlanScheduled(tenantId: string, payload: AccountRemovalScheduledEventPayload): Promise<void> {
        await this.outbox.enqueue(new AccountRemovalScheduledEvent(tenantId, payload));
    }
}
