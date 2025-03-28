import { IntegrationEvent } from "../IntegrationEvent";

import { IntegrationEventTopics } from "@/common/events";

export type AccountRemovalRequestedEventPayload = {
    account: {
        id: string;
        email: string;
        providerId: string;
    };
};

export class AccountRemovalRequestedEvent extends IntegrationEvent<AccountRemovalRequestedEventPayload> {
    public constructor(tenantId: string, payload: AccountRemovalRequestedEventPayload) {
        super(tenantId, IntegrationEventTopics.account.removal.requested, payload);
    }
}
