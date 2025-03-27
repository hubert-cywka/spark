import { IntegrationEvent } from "../IntegrationEvent";

import { IntegrationEventTopics } from "@/common/events";

export type AccountRemovalCompletedEventPayload = {
    account: {
        id: string;
        email: string;
    };
};

export class AccountRemovalCompletedEvent extends IntegrationEvent<AccountRemovalCompletedEventPayload> {
    public constructor(tenantId: string, payload: AccountRemovalCompletedEventPayload) {
        super(tenantId, IntegrationEventTopics.account.removal.completed, payload);
    }
}
