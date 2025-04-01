import { TwoFactorAuthenticationOption } from "@/modules/identity/2fa/models/TwoFactorAuthenticationOption.model";

export const TwoFactorAuthenticationMethodsProviderServiceToken = Symbol("TwoFactorAuthenticationMethodsProviderService");

export interface ITwoFactorAuthenticationMethodsProviderService {
    findEnabledMethods(accountId: string): Promise<TwoFactorAuthenticationOption[]>;
}
