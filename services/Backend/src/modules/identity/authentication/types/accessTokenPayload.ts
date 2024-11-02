import { Account } from "@/modules/identity/account/models/Account.model";

export type AccessTokenPayload = {
    ver: number;
} & Account;
