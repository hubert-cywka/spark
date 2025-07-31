import { IntegrationEvent, IntegrationEvents } from "@/common/events";

export type AccountActivatedEventPayload = {
    account: {
        id: string;
        email: string;
    };
};

export class AccountActivatedEvent extends IntegrationEvent<AccountActivatedEventPayload> {
    public constructor(tenantId: string, payload: AccountActivatedEventPayload) {
        const topic = IntegrationEvents.account.activation.completed.topic;
        const subject = IntegrationEvents.account.activation.completed.subject;

        super({
            topic,
            subject,
            partitionKey: `${topic}_${tenantId}`,
            payload,
            tenantId,
        });
    }
}
