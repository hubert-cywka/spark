import type { Account } from "@/modules/identity/account/models/Account.model";
import { FederatedAccountProvider } from "@/modules/identity/authentication/types/ManagedAccountProvider";

export const FederatedAccountServiceToken = Symbol("IFederatedAccountService");

export interface IFederatedAccountService {
    findByExternalIdentity(providerAccountId: string, providerId: FederatedAccountProvider): Promise<Account>;
    createAccountWithExternalIdentity(providerAccountId: string, providerId: FederatedAccountProvider, email: string): Promise<Account>;
    activateByInternalId(accountId: string): Promise<void>;
}
