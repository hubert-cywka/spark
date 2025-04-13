import { IntegrationEvent, IntegrationEventTopics } from "@/common/events";

export type AccountRegisteredEventPayload = {
    account: {
        id: string;
        email: string;
        lastName: string;
        firstName: string;
    };
};

export class AccountRegisteredEvent extends IntegrationEvent<AccountRegisteredEventPayload> {
    public constructor(tenantId: string, payload: AccountRegisteredEventPayload) {
        super(tenantId, IntegrationEventTopics.account.registration.completed, payload);
    }
}
