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
import { type IDataPurgePublisherService } from "@/modules/gdpr/services/interfaces/IDataPurgePublisher.service";

@Injectable()
export class DataPurgePublisherService implements IDataPurgePublisherService {
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
