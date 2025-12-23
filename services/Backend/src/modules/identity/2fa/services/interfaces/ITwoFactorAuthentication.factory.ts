import { type ITwoFactorAuthenticationIntegrationService } from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationIntegrationService";
import { TwoFactorAuthenticationMethod } from "@/modules/identity/2fa/types/TwoFactorAuthenticationMethod";

export const TwoFactorAuthenticationFactoryToken = Symbol("TwoFactorAuthenticationFactory");

export interface ITwoFactorAuthenticationFactory {
    createIntegrationService: (method: TwoFactorAuthenticationMethod) => ITwoFactorAuthenticationIntegrationService;
}
