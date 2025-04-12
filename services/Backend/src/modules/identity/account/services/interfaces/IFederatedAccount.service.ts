import type { Account } from "@/modules/identity/account/models/Account.model";
import { type ExternalIdentity } from "@/modules/identity/authentication/types/OpenIDConnect";

export const FederatedAccountServiceToken = Symbol("IFederatedAccountService");

export interface IFederatedAccountService {
    findByExternalIdentity(identity: ExternalIdentity): Promise<Account>;
    createAccountWithExternalIdentity(identity: ExternalIdentity): Promise<Account>;

    activateByInternalId(accountId: string): Promise<void>;
    removeByInternalId(id: string): Promise<void>;
    suspendByInternalId(id: string): Promise<void>;
}
