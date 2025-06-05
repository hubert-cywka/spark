import { IntegrationEvent, IntegrationEventTopics } from "@/common/events";

export type AccountActivationTokenRequestedEventPayload = {
    account: { id: string };
    redirectUrl: string;
};

export class AccountActivationTokenRequestedEvent extends IntegrationEvent<AccountActivationTokenRequestedEventPayload> {
    public constructor(tenantId: string, payload: AccountActivationTokenRequestedEventPayload) {
        super({
            topic: IntegrationEventTopics.account.activation.requested,
            payload,
            partitionKey: tenantId,
            tenantId,
        });
    }
}
