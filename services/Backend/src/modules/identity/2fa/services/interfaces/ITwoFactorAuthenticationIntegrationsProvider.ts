import { TwoFactorAuthenticationIntegration } from "@/modules/identity/2fa/models/TwoFactorAuthenticationIntegration.model";

export const TwoFactorAuthenticationMethodsProviderToken = Symbol("TwoFactorAuthenticationMethodsProviderToken");

export interface ITwoFactorAuthenticationIntegrationsProvider {
    findActiveIntegrations(accountId: string): Promise<TwoFactorAuthenticationIntegration[]>;
    enableDefaultIntegrations(accountId: string): Promise<void>;
}
