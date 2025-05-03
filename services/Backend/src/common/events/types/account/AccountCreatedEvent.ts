import { IntegrationEvent, IntegrationEventTopics } from "@/common/events";

export type AccountCreatedEventPayload = {
    id: string;
    email: string;
};

export class AccountCreatedEvent extends IntegrationEvent<AccountCreatedEventPayload> {
    public constructor(tenantId: string, payload: AccountCreatedEventPayload) {
        super(tenantId, IntegrationEventTopics.account.created, payload);
    }
}
