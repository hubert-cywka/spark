import type { Account } from "@/modules/identity/account/models/Account.model";
import { type ExternalIdentity } from "@/modules/identity/authentication/types/OpenIDConnect";

export const IFederatedAccountServiceToken = Symbol("IFederatedAccountService");

export interface IFederatedAccountService {
    findByExternalIdentity(identity: ExternalIdentity): Promise<Account>;
    createAccountWithExternalIdentity(identity: ExternalIdentity): Promise<Account>;
}
