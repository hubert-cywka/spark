import type { Account } from "@/modules/identity/account/models/Account.model";
import type { AccountProvider } from "@/modules/identity/authentication/types/AccountProvider";
import { type ExternalIdentity } from "@/modules/identity/authentication/types/OpenIDConnect";

export const IFederatedAccountServiceToken = Symbol("IFederatedAccountService");

export interface IFederatedAccountService {
    findByExternalIdentity(identity: ExternalIdentity, identityProviderId: AccountProvider): Promise<Account>;
    createAccountWithExternalIdentity(identity: ExternalIdentity, identityProviderId: AccountProvider): Promise<Account>;
}
