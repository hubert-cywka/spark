import { TwoFactorAuthenticationMethod } from "@/modules/identity/2fa/types/TwoFactorAuthenticationMethod";
import { User } from "@/types/User";

export const TwoFactorAuthenticationModuleFacadeToken = Symbol("TwoFactorAuthenticationModuleFacade");

export interface ITwoFactorAuthenticationModuleFacade {
    validateTOTP(user: User, code: string, method: TwoFactorAuthenticationMethod): Promise<boolean>;
}
