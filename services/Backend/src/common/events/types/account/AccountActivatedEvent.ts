import { IntegrationEvent, IntegrationEventTopics } from "@/common/events";

export type AccountActivatedEventPayload = {
    id: string;
    email: string;
};

export class AccountActivatedEvent extends IntegrationEvent<AccountActivatedEventPayload> {
    public constructor(tenantId: string, payload: AccountActivatedEventPayload) {
        super({
            topic: IntegrationEventTopics.account.activation.completed,
            payload,
            tenantId,
        });
    }
}
