import type { Account } from "@/modules/identity/account/models/Account.model";

export type AccessTokenPayload = {
    ver: number;
    account: Account;
};

export type AuthenticationResult = {
    accessToken: string;
    refreshToken: string;
    account: Account;
};
