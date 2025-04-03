import { TwoFactorAuthenticationMethod } from "@/features/auth/types/TwoFactorAuthentication";

export type Confirm2FAMethodDto = {
    code: string;
    method: TwoFactorAuthenticationMethod;
};
