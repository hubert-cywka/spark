import { IntegrationEvent, IntegrationEventTopics } from "@/common/events";

export type AccountCreatedEventPayload = {
    account: {
        id: string;
        email: string;
    };
};

export class AccountCreatedEvent extends IntegrationEvent<AccountCreatedEventPayload> {
    public constructor(tenantId: string, payload: AccountCreatedEventPayload) {
        super({
            topic: IntegrationEventTopics.account.created,
            payload,
            partitionKey: tenantId,
            tenantId,
        });
    }
}
