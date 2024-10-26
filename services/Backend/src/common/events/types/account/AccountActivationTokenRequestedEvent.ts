import { DomainEvent } from "../DomainEvent";

import { EventTopics } from "@/common/events";

export type AccountActivationTokenRequestedEventPayload = {
    activationToken: string;
    email: string;
};

export class AccountActivationTokenRequestedEvent extends DomainEvent {
    public constructor(payload: AccountActivationTokenRequestedEventPayload) {
        super(EventTopics.account.activationTokenRequested, payload);
    }
}
