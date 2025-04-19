import { IntegrationEvent, IntegrationEventTopics } from "@/common/events";

export type AccountActivationTokenRequestedEventPayload = {
    email: string;
    redirectUrl: string;
};

export class AccountActivationTokenRequestedEvent extends IntegrationEvent<AccountActivationTokenRequestedEventPayload> {
    public constructor(tenantId: string, payload: AccountActivationTokenRequestedEventPayload) {
        super(tenantId, IntegrationEventTopics.account.activation.requested, payload);
    }
}
