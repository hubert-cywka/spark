import { EmailIntegrationTOTPIssuedEventPayload } from "@/common/events";

export const TwoFactorAuthenticationEventsPublisherToken = Symbol("TwoFactorAuthenticationEventsPublisher");

export interface ITwoFactorAuthenticationEventsPublisher {
    onTOTPIssued(tenantId: string, payload: EmailIntegrationTOTPIssuedEventPayload): Promise<void>;
}
