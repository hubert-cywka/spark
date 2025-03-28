import { IntegrationEvent } from "../IntegrationEvent";

import { IntegrationEventTopics } from "@/common/events";

export type AccountActivationTokenRequestedEventPayload = {
    activationToken: string;
    email: string;
};

export class AccountActivationTokenRequestedEvent extends IntegrationEvent<AccountActivationTokenRequestedEventPayload> {
    public constructor(tenantId: string, payload: AccountActivationTokenRequestedEventPayload) {
        super(tenantId, IntegrationEventTopics.account.activation.requested, payload);
    }
}
