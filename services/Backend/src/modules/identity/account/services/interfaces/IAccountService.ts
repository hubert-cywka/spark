import { Account } from "@/modules/identity/account/models/Account.model";

export const IAccountServiceToken = Symbol("IAccountService");

export interface IAccountService {
    findByCredentials(email: string, password: string): Promise<Account>;
    save(email: string, password: string): Promise<Account>;
    requestActivation(email: string): Promise<void>;
    activate(activationToken: string): Promise<void>;
    requestPasswordChange(email: string): Promise<void>;
    updatePassword(passwordChangeToken: string, password: string): Promise<void>;
}
