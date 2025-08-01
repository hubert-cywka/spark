import { IntegrationEvent, IntegrationEvents } from "@/common/events";

export type AccountActivationTokenRequestedEventPayload = {
    account: { id: string; email: string };
    redirectUrl: string;
};

export class AccountActivationTokenRequestedEvent extends IntegrationEvent<AccountActivationTokenRequestedEventPayload> {
    public constructor(tenantId: string, payload: AccountActivationTokenRequestedEventPayload) {
        const topic = IntegrationEvents.account.activation.requested.topic;
        const subject = IntegrationEvents.account.activation.requested.subject;

        super({
            topic,
            subject,
            partitionKey: `${topic}_${tenantId}`,
            payload,
            tenantId,
        });
    }
}
