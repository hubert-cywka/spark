import { IntegrationEvent } from "../IntegrationEvent";

import { IntegrationEventTopics } from "@/common/events";

export type AccountSuspendedEventPayload = {
    id: string;
};

export class AccountSuspendedEvent extends IntegrationEvent<AccountSuspendedEventPayload> {
    public constructor(tenantId: string, payload: AccountSuspendedEventPayload) {
        super(tenantId, IntegrationEventTopics.account.suspended, payload);
    }
}
