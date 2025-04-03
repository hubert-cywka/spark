import { TwoFactorAuthenticationMethod } from "@/features/auth/types/TwoFactorAuthentication";

export type ConfirmTwoFactorAuthenticationIntegrationDto = {
    code: string;
    method: TwoFactorAuthenticationMethod;
};
