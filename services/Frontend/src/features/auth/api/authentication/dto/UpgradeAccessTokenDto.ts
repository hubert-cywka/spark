import { AccessScope } from "@/features/auth/types/Identity";
import { TwoFactorAuthenticationMethod } from "@/features/auth/types/TwoFactorAuthentication";

export type UpgradeAccessTokenDto = {
    code: string;
    method: TwoFactorAuthenticationMethod;
    scopes: AccessScope[];
};
