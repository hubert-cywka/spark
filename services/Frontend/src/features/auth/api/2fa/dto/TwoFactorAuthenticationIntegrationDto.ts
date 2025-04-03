import { TwoFactorAuthenticationMethod } from "@/features/auth/types/TwoFactorAuthentication";

export type TwoFactorAuthenticationIntegrationDto = {
    method: TwoFactorAuthenticationMethod;
    enabledAt: string;
};
