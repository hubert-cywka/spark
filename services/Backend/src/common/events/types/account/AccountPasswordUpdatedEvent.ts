import { IntegrationEvent, IntegrationEvents } from "@/common/events";

export type AccountPasswordUpdatedEventPayload = {
    account: { id: string };
};

export class AccountPasswordUpdatedEvent extends IntegrationEvent<AccountPasswordUpdatedEventPayload> {
    public constructor(tenantId: string, payload: AccountPasswordUpdatedEventPayload) {
        const topic = IntegrationEvents.account.password.updated.topic;
        const subject = IntegrationEvents.account.password.updated.subject;

        super({
            topic,
            subject,
            partitionKey: `${topic}_${tenantId}`,
            payload,
            tenantId,
        });
    }
}
