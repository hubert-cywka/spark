import { IntegrationEvent, IntegrationEvents } from "@/common/events";

export type AccountRemovalRequestedEventPayload = {
    account: {
        id: string;
    };
};

export class AccountRemovalRequestedEvent extends IntegrationEvent<AccountRemovalRequestedEventPayload> {
    public constructor(tenantId: string, payload: AccountRemovalRequestedEventPayload) {
        const topic = IntegrationEvents.account.removal.requested.topic;
        const subject = IntegrationEvents.account.removal.requested.subject;

        super({
            topic,
            subject,
            partitionKey: `${topic}_${tenantId}`,
            payload,
            tenantId,
        });
    }
}
