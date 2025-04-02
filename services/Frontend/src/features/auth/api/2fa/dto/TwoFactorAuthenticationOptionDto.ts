import { TwoFactorAuthenticationMethod } from "@/features/auth/types/TwoFactorAuthentication";

export type TwoFactorAuthenticationOptionDto = {
    method: TwoFactorAuthenticationMethod;
    enabledAt: string;
};
