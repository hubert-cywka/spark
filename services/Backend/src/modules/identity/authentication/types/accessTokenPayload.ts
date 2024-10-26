import { Account } from "@/modules/identity/account/models/Account.model";

export type AccessTokenPayload = {
    ver: string;
} & Account;
