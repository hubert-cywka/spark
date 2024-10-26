import { DomainEvent } from "../DomainEvent";

import { EventTopics } from "@/common/events";

export type AccountActivatedEventPayload = {
    account: {
        id: string;
    };
};

export class AccountActivatedEvent extends DomainEvent {
    public constructor(payload: AccountActivatedEventPayload) {
        super(EventTopics.account.activated, payload);
    }
}
