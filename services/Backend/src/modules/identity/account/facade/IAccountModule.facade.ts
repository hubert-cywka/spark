import { Account } from "@/modules/identity/account/models/Account.model";
import { FederatedAccountProvider } from "@/modules/identity/authentication/types/ManagedAccountProvider";

export const AccountModuleFacadeToken = Symbol("AccountModuleFacade");

export interface IAccountModuleFacade {
    createFederatedAccount(providerAccountId: string, providerId: FederatedAccountProvider, email: string): Promise<Account>;
    findFederatedAccount(providerAccountId: string, providerId: FederatedAccountProvider): Promise<Account>;

    createManagedAccount(email: string, password: string, clientRedirectUrl: string): Promise<Account>;
    findManagedAccount(email: string, password: string): Promise<Account>;
}
