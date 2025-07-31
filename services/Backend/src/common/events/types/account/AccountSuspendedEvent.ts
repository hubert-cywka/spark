import { IntegrationEvent, IntegrationEvents } from "@/common/events";

export type AccountSuspendedEventPayload = {
    account: {
        id: string;
    };
};

export class AccountSuspendedEvent extends IntegrationEvent<AccountSuspendedEventPayload> {
    public constructor(tenantId: string, payload: AccountSuspendedEventPayload) {
        const topic = IntegrationEvents.account.suspended.topic;
        const subject = IntegrationEvents.account.suspended.subject;

        super({
            topic,
            subject,
            partitionKey: `${topic}_${tenantId}`,
            payload,
            tenantId,
        });
    }
}
