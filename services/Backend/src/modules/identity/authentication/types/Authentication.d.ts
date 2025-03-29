import type { AccessScope } from "@/common/types/AccessScope";
import type { Account } from "@/modules/identity/account/models/Account.model";

export type AccessTokenPayload = {
    ver: number;
    account: Account;
    accessScopes: AccessScope[];
};

export type AuthenticationResult = {
    accessToken: string;
    refreshToken: string;
    account: Account;
    accessScopes: AccessScope[];
};
