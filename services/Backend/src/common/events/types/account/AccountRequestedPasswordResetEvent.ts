import { IntegrationEvent, IntegrationEvents } from "@/common/events";

export type AccountRequestedPasswordResetEventPayload = {
    account: { id: string };
    redirectUrl: string;
};

export class AccountRequestedPasswordResetEvent extends IntegrationEvent<AccountRequestedPasswordResetEventPayload> {
    public constructor(tenantId: string, payload: AccountRequestedPasswordResetEventPayload) {
        const topic = IntegrationEvents.account.password.resetRequested.topic;
        const subject = IntegrationEvents.account.password.resetRequested.subject;

        super({
            topic,
            subject,
            partitionKey: `${topic}_${tenantId}`,
            payload,
            tenantId,
        });
    }
}
