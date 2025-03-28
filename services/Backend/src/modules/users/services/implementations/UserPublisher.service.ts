import { Inject, Injectable } from "@nestjs/common";

import { EventOutboxToken } from "@/common/events/services/interfaces/IEventOutbox";
import { type IEventOutbox } from "@/common/events/services/interfaces/IEventOutbox";
import {
    type AccountRemovalRequestedEventPayload,
    AccountRemovalRequestedEvent,
} from "@/common/events/types/account/AccountRemovalRequestedEvent";
import { type IUserPublisherService } from "@/modules/users/services/interfaces/IUserPublisher.service";

@Injectable()
export class UserPublisherService implements IUserPublisherService {
    public constructor(
        @Inject(EventOutboxToken)
        private readonly outbox: IEventOutbox
    ) {}

    public async onDataRemovalRequested(tenantId: string, payload: AccountRemovalRequestedEventPayload): Promise<void> {
        await this.outbox.enqueue(new AccountRemovalRequestedEvent(tenantId, payload));
    }
}
