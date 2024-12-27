import { IntegrationEvent } from "../IntegrationEvent";

import { IntegrationEventTopics } from "@/common/events";

export type AccountActivatedEventPayload = {
    id: string;
    email: string;
};

export class AccountActivatedEvent extends IntegrationEvent {
    public constructor(payload: AccountActivatedEventPayload) {
        super(IntegrationEventTopics.account.activated, payload);
    }
}
