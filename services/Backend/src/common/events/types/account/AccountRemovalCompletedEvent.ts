import { IntegrationEvent, IntegrationEvents } from "@/common/events";

export type AccountRemovalCompletedEventPayload = {
    account: {
        id: string;
    };
};

export class AccountRemovalCompletedEvent extends IntegrationEvent<AccountRemovalCompletedEventPayload> {
    public constructor(tenantId: string, payload: AccountRemovalCompletedEventPayload) {
        const topic = IntegrationEvents.account.removal.completed.topic;
        const subject = IntegrationEvents.account.removal.completed.subject;

        super({
            topic,
            subject,
            partitionKey: `${topic}_${tenantId}`,
            payload,
            tenantId,
        });
    }
}
