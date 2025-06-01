import { IntegrationEvent, IntegrationEventTopics } from "@/common/events";

export type AccountRemovalCompletedEventPayload = {
    account: {
        id: string;
    };
};

export class AccountRemovalCompletedEvent extends IntegrationEvent<AccountRemovalCompletedEventPayload> {
    public constructor(tenantId: string, payload: AccountRemovalCompletedEventPayload) {
        super({
            topic: IntegrationEventTopics.account.removal.completed,
            payload,
            partitionKey: tenantId,
            tenantId,
        });
    }
}
