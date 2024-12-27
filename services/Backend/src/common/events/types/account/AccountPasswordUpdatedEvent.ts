import { IntegrationEvent } from "../IntegrationEvent";

import { IntegrationEventTopics } from "@/common/events";

export type AccountPasswordUpdatedEventPayload = {
    email: string;
    id: string;
};

export class AccountPasswordUpdatedEvent extends IntegrationEvent {
    public constructor(payload: AccountPasswordUpdatedEventPayload) {
        super(IntegrationEventTopics.account.passwordUpdated, payload);
    }
}
