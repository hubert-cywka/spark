import { IntegrationEvent } from "../IntegrationEvent";

import { IntegrationEventTopics } from "@/common/events";

export type AccountRegisteredEventPayload = {
    account: {
        id: string;
        email: string;
        lastName: string;
        firstName: string;
        isActivated: boolean;
    };
};

export class AccountRegisteredEvent extends IntegrationEvent<AccountRegisteredEventPayload> {
    public constructor(payload: AccountRegisteredEventPayload) {
        super(IntegrationEventTopics.account.registered, payload);
    }
}
