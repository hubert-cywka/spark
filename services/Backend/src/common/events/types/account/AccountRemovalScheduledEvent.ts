import { IntegrationEvent, IntegrationEventTopics } from "@/common/events";

export type AccountRemovalScheduledEventPayload = {
    toBeRemovedAt: string;
    account: {
        id: string;
    };
};

export class AccountRemovalScheduledEvent extends IntegrationEvent<AccountRemovalScheduledEventPayload> {
    public constructor(tenantId: string, payload: AccountRemovalScheduledEventPayload) {
        super({
            topic: IntegrationEventTopics.account.removal.scheduled,
            payload,
            tenantId,
        });
    }
}
