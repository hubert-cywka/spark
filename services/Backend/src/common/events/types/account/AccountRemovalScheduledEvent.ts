import { IntegrationEvent, IntegrationEvents } from "@/common/events";

export type AccountRemovalScheduledEventPayload = {
    toBeRemovedAt: string;
    account: {
        id: string;
    };
};

export class AccountRemovalScheduledEvent extends IntegrationEvent<AccountRemovalScheduledEventPayload> {
    public constructor(tenantId: string, payload: AccountRemovalScheduledEventPayload) {
        const topic = IntegrationEvents.account.removal.scheduled.topic;
        const subject = IntegrationEvents.account.removal.scheduled.subject;

        super({
            topic,
            subject,
            partitionKey: `${topic}_${tenantId}`,
            payload,
            tenantId,
        });
    }
}
