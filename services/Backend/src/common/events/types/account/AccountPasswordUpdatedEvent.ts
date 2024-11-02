import { DomainEvent } from "../DomainEvent";

import { EventTopics } from "@/common/events";

export type AccountPasswordUpdatedEventPayload = {
    email: string;
    id: string;
};

export class AccountPasswordUpdatedEvent extends DomainEvent {
    public constructor(payload: AccountPasswordUpdatedEventPayload) {
        super(EventTopics.account.passwordUpdated, payload);
    }
}
