import { IntegrationEvent, IntegrationEventTopics } from "@/common/events";

export type AccountSuspendedEventPayload = {
    account: {
        id: string;
    };
};

export class AccountSuspendedEvent extends IntegrationEvent<AccountSuspendedEventPayload> {
    public constructor(tenantId: string, payload: AccountSuspendedEventPayload) {
        super({
            topic: IntegrationEventTopics.account.suspended,
            payload,
            tenantId,
        });
    }
}
