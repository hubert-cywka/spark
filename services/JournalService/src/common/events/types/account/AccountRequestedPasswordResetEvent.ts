import { IntegrationEvent } from "../IntegrationEvent";

import { IntegrationEventTopics } from "@/common/events";

export type AccountRequestedPasswordResetEventPayload = {
    email: string;
    passwordResetToken: string;
};

export class AccountRequestedPasswordResetEvent extends IntegrationEvent<AccountRequestedPasswordResetEventPayload> {
    public constructor(payload: AccountRequestedPasswordResetEventPayload) {
        super(IntegrationEventTopics.account.password.resetRequested, payload);
    }
}
