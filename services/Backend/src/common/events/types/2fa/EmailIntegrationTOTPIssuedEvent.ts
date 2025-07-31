import { IntegrationEvent, IntegrationEvents } from "@/common/events";

export type EmailIntegrationTOTPIssuedEventPayload = {
    account: {
        id: string;
    };
    code: string;
};

export class EmailIntegrationTOTPIssuedEvent extends IntegrationEvent<EmailIntegrationTOTPIssuedEventPayload> {
    public constructor(tenantId: string, payload: EmailIntegrationTOTPIssuedEventPayload) {
        const topic = IntegrationEvents.twoFactorAuth.email.issued.topic;
        const subject = IntegrationEvents.twoFactorAuth.email.issued.subject;

        super({
            topic,
            subject,
            partitionKey: `${topic}_${tenantId}`,
            payload,
            tenantId,
        });
    }
}
