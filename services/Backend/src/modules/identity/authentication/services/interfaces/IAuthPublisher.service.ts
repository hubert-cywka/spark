import type { Account } from "@/modules/identity/account/models/Account.model";

export const IAuthPublisherServiceToken = Symbol("IAuthPublisherServiceToken");

export interface IAuthPublisherService {
    onAccountRegistered(account: { lastName: string; firstName: string } & Account): void;
}
