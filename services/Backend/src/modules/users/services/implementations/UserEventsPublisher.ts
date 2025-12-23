import { Inject, Injectable } from "@nestjs/common";

import { EventPublisherToken } from "@/common/events/services/interfaces/IEventPublisher";
import { type IEventPublisher } from "@/common/events/services/interfaces/IEventPublisher";
import {
    type AccountRemovalRequestedEventPayload,
    AccountRemovalRequestedEvent,
} from "@/common/events/types/account/AccountRemovalRequestedEvent";
import { type IUserEventsPublisher } from "@/modules/users/services/interfaces/IUserEventsPublisher";

@Injectable()
export class UserEventsPublisher implements IUserEventsPublisher {
    public constructor(
        @Inject(EventPublisherToken)
        private readonly publisher: IEventPublisher
    ) {}

    public async onDataRemovalRequested(tenantId: string, payload: AccountRemovalRequestedEventPayload): Promise<void> {
        await this.publisher.enqueue(new AccountRemovalRequestedEvent(tenantId, payload));
    }
}
