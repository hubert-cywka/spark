import { Inject, Injectable } from "@nestjs/common";

import { EventOutboxToken } from "@/common/events/services/interfaces/IEventOutbox";
import { type IEventOutbox } from "@/common/events/services/interfaces/IEventOutbox";
import {
    AccountRemovalCompletedEvent,
    AccountRemovalCompletedEventPayload,
} from "@/common/events/types/account/AccountRemovalCompletedEvent";
import { type ITenantPublisherService } from "@/modules/gdpr/services/interfaces/ITenantPublisher.service";

@Injectable()
export class TenantPublisherService implements ITenantPublisherService {
    public constructor(
        @Inject(EventOutboxToken)
        private readonly outbox: IEventOutbox
    ) {}

    public async onDataPurged(tenantId: string, payload: AccountRemovalCompletedEventPayload): Promise<void> {
        await this.outbox.enqueue(new AccountRemovalCompletedEvent(tenantId, payload));
    }
}
