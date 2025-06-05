import { IntegrationEvent, IntegrationEventTopics } from "@/common/events";

export type AccountActivatedEventPayload = {
    account: {
        id: string;
        email: string;
    };
};

export class AccountActivatedEvent extends IntegrationEvent<AccountActivatedEventPayload> {
    public constructor(tenantId: string, payload: AccountActivatedEventPayload) {
        super({
            topic: IntegrationEventTopics.account.activation.completed,
            payload,
            partitionKey: tenantId,
            tenantId,
        });
    }
}
