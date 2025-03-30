import { TwoFactorAuthenticationMethod } from "@/modules/identity/authentication/types/TwoFactorAuthenticationMethod";

export type TwoFactorAuthenticationOption = {
    id: string;
    method: TwoFactorAuthenticationMethod;
    secret: string;
    createdAt: Date;
    updatedAt: Date;
    enabledAt: Date | null;
};
