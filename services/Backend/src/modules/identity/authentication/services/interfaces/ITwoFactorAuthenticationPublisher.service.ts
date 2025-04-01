import { Email2FACodeIssuedEventPayload } from "@/common/events";

export const TwoFactorAuthenticationPublisherServiceToken = Symbol("TwoFactorAuthenticationPublisherService");

export interface ITwoFactorAuthenticationPublisherService {
    onEmail2FACodeIssued(tenantId: string, payload: Email2FACodeIssuedEventPayload): Promise<void>;
}
