import type { Account } from "@/modules/identity/account/models/Account.model";
import { FederatedAccountProvider } from "@/modules/identity/authentication/types/ManagedAccountProvider";
import { type ExternalIdentity } from "@/modules/identity/authentication/types/OpenIDConnect";

export const IFederatedAccountServiceToken = Symbol("IFederatedAccountService");

export interface IFederatedAccountService {
    findByExternalIdentity(identity: ExternalIdentity, identityProviderId: FederatedAccountProvider): Promise<Account>;
    createAccountWithExternalIdentity(identity: ExternalIdentity, identityProviderId: FederatedAccountProvider): Promise<Account>;
}
