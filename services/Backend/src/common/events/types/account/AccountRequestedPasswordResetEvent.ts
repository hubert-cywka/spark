import { IntegrationEvent, IntegrationEventTopics } from "@/common/events";

export type AccountRequestedPasswordResetEventPayload = {
    account: { id: string };
    redirectUrl: string;
};

export class AccountRequestedPasswordResetEvent extends IntegrationEvent<AccountRequestedPasswordResetEventPayload> {
    public constructor(tenantId: string, payload: AccountRequestedPasswordResetEventPayload) {
        super({
            topic: IntegrationEventTopics.account.password.resetRequested,
            payload,
            tenantId,
        });
    }
}
