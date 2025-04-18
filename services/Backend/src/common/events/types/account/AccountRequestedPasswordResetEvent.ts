import { IntegrationEvent, IntegrationEventTopics } from "@/common/events";

export type AccountRequestedPasswordResetEventPayload = {
    email: string;
    redirectUrl: string;
};

export class AccountRequestedPasswordResetEvent extends IntegrationEvent<AccountRequestedPasswordResetEventPayload> {
    public constructor(tenantId: string, payload: AccountRequestedPasswordResetEventPayload) {
        super(tenantId, IntegrationEventTopics.account.password.resetRequested, payload);
    }
}
