import { IntegrationEvent, IntegrationEventTopics } from "@/common/events";

export type AccountRemovalRequestedEventPayload = {
    retentionPeriod: number;
    account: {
        id: string;
        email: string;
    };
};

export class AccountRemovalRequestedEvent extends IntegrationEvent<AccountRemovalRequestedEventPayload> {
    public constructor(tenantId: string, payload: AccountRemovalRequestedEventPayload) {
        super({
            topic: IntegrationEventTopics.account.removal.requested,
            payload,
            tenantId,
        });
    }
}
