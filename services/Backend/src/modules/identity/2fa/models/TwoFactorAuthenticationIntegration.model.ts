import { TwoFactorAuthenticationMethod } from "@/modules/identity/2fa/types/TwoFactorAuthenticationMethod";

export type TwoFactorAuthenticationIntegration = {
    id: string;
    method: TwoFactorAuthenticationMethod;
    secret: string;
    totpTTL: number;
    createdAt: Date;
    updatedAt: Date;
    enabledAt: Date | null;
};
