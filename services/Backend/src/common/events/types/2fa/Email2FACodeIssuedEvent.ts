import { IntegrationEvent, IntegrationEventTopics } from "@/common/events";

export type Email2FACodeIssuedEventPayload = {
    email: string;
    code: string;
};

export class Email2FACodeIssuedEvent extends IntegrationEvent<Email2FACodeIssuedEventPayload> {
    public constructor(tenantId: string, payload: Email2FACodeIssuedEventPayload) {
        super(tenantId, IntegrationEventTopics.twoFactorAuth.email.issued, payload);
    }
}
