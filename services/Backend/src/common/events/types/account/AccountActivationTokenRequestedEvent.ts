import { IntegrationEvent } from "../IntegrationEvent";

import { IntegrationEventTopics } from "@/common/events";

export type AccountActivationTokenRequestedEventPayload = {
    activationToken: string;
    email: string;
};

export class AccountActivationTokenRequestedEvent extends IntegrationEvent {
    public constructor(payload: AccountActivationTokenRequestedEventPayload) {
        super(IntegrationEventTopics.account.activationTokenRequested, payload);
    }
}
