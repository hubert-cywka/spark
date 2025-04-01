import { TwoFactorAuthenticationMethod } from "@/modules/identity/2fa/types/TwoFactorAuthenticationMethod";

export type TwoFactorAuthenticationOption = {
    id: string;
    method: TwoFactorAuthenticationMethod;
    secret: string;
    createdAt: Date;
    updatedAt: Date;
    enabledAt: Date | null;
};
