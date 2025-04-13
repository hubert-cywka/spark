import { type AccessScopes } from "@/common/types/AccessScope";
import { type Account } from "@/modules/identity/account/models/Account.model";

export type AccessTokenPayload = {
    ver: number;
    account: Account;
    accessScopes: AccessScopes;
};

export type AuthenticationResult = {
    accessToken: string;
    refreshToken: string;
    account: Account;
    accessScopes: AccessScopes;
};

export type Credentials = {
    email: string;
    password: string;
};

export type PersonalInformation = {
    lastName: string;
    firstName: string;
};
