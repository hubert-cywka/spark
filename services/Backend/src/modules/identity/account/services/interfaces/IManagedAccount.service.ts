import type { Account } from "@/modules/identity/account/models/Account.model";

export const IManagedAccountServiceToken = Symbol("IManagedAccountService");

export interface IManagedAccountService {
    findActivatedByCredentials(email: string, password: string): Promise<Account>;
    createAccountWithCredentials(email: string, password: string): Promise<Account>;

    requestActivation(email: string): Promise<void>;
    activate(activationToken: string): Promise<void>;

    requestPasswordChange(email: string): Promise<void>;
    updatePassword(passwordChangeToken: string, password: string): Promise<void>;
}
