import { EmailIntegrationTOTPIssuedEventPayload } from "@/common/events";

export const TwoFactorAuthenticationEmailIntegrationPublisherServiceToken = Symbol(
    "TwoFactorAuthenticationEmailIntegrationPublisherService"
);

export interface ITwoFactorAuthenticationEmailIntegrationPublisherService {
    onEmailIntegrationTOTPIssued(tenantId: string, payload: EmailIntegrationTOTPIssuedEventPayload): Promise<void>;
}
