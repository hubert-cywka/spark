import { IntegrationEvent } from "../IntegrationEvent";

import { IntegrationEventTopics } from "@/common/events";

export type AccountRequestedPasswordResetEventPayload = {
    email: string;
    passwordResetToken: string;
};

export class AccountRequestedPasswordResetEvent extends IntegrationEvent<AccountRequestedPasswordResetEventPayload> {
    public constructor(tenantId: string, payload: AccountRequestedPasswordResetEventPayload) {
        super(tenantId, IntegrationEventTopics.account.password.resetRequested, payload);
    }
}
