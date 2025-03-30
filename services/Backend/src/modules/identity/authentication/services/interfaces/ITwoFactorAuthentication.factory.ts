import { type ITwoFactorAuthenticationService } from "@/modules/identity/authentication/services/interfaces/ITwoFactorAuthentication.service";
import { TwoFactorAuthenticationMethod } from "@/modules/identity/authentication/types/TwoFactorAuthenticationMethod";

export const TwoFactorAuthenticationFactoryToken = Symbol("TwoFactorAuthenticationFactory");

export interface ITwoFactorAuthenticationFactory {
    create: (method: TwoFactorAuthenticationMethod) => ITwoFactorAuthenticationService;
}
