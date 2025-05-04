import { IntegrationEvent, IntegrationEventTopics } from "@/common/events";

export type EmailIntegrationTOTPIssuedEventPayload = {
    email: string;
    code: string;
};

export class EmailIntegrationTOTPIssuedEvent extends IntegrationEvent<EmailIntegrationTOTPIssuedEventPayload> {
    public constructor(tenantId: string, payload: EmailIntegrationTOTPIssuedEventPayload) {
        super({
            topic: IntegrationEventTopics.twoFactorAuth.email.issued,
            payload,
            tenantId,
        });
    }
}
