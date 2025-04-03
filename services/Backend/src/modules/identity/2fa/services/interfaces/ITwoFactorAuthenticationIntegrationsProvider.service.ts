import { TwoFactorAuthenticationIntegration } from "@/modules/identity/2fa/models/TwoFactorAuthenticationIntegration.model";

export const TwoFactorAuthenticationMethodsProviderServiceToken = Symbol("TwoFactorAuthenticationMethodsProviderService");

export interface ITwoFactorAuthenticationIntegrationsProviderService {
    findActiveIntegrations(accountId: string): Promise<TwoFactorAuthenticationIntegration[]>;
    enableDefaultIntegrations(accountId: string): Promise<void>;
}
