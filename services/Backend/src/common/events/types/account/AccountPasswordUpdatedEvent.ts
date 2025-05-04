import { IntegrationEvent, IntegrationEventTopics } from "@/common/events";

export type AccountPasswordUpdatedEventPayload = {
    email: string;
    id: string;
};

export class AccountPasswordUpdatedEvent extends IntegrationEvent<AccountPasswordUpdatedEventPayload> {
    public constructor(tenantId: string, payload: AccountPasswordUpdatedEventPayload) {
        super({
            topic: IntegrationEventTopics.account.password.updated,
            payload,
            tenantId,
        });
    }
}
