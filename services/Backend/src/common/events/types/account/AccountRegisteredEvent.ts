import { DomainEvent } from "../DomainEvent";

import { EventTopics } from "@/common/events";

export type AccountRegisteredEventPayload = {
    account: {
        id: string;
        email: string;
        lastName: string;
        firstName: string;
    };
};

export class AccountRegisteredEvent extends DomainEvent {
    public constructor(payload: AccountRegisteredEventPayload) {
        super(EventTopics.account.registered, payload);
    }
}
