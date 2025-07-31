import { IntegrationEvent, IntegrationEvents } from "@/common/events";

export type AccountCreatedEventPayload = {
    account: {
        id: string;
        email: string;
    };
};

export class AccountCreatedEvent extends IntegrationEvent<AccountCreatedEventPayload> {
    public constructor(tenantId: string, payload: AccountCreatedEventPayload) {
        const topic = IntegrationEvents.account.created.topic;
        const subject = IntegrationEvents.account.created.subject;

        super({
            topic,
            subject,
            partitionKey: `${topic}_${tenantId}`,
            payload,
            tenantId,
        });
    }
}
