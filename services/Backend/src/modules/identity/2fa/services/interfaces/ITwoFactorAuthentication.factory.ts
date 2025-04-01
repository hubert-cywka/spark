import { type ITwoFactorAuthenticationService } from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthentication.service";
import { TwoFactorAuthenticationMethod } from "@/modules/identity/2fa/types/TwoFactorAuthenticationMethod";

export const TwoFactorAuthenticationFactoryToken = Symbol("TwoFactorAuthenticationFactory");

export interface ITwoFactorAuthenticationFactory {
    create: (method: TwoFactorAuthenticationMethod) => ITwoFactorAuthenticationService;
}
