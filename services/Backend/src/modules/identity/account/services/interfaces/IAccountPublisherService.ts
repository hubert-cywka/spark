import { Account } from "@/modules/identity/account/models/Account.model";

export const IAccountPublisherServiceToken = Symbol("IAccountPublisherServiceToken");

export interface IAccountPublisherService {
    onAccountActivated(account: Account): void;
    onAccountActivationTokenRequested(email: string, activationToken: string): void;
    onPasswordResetRequested(email: string, passwordResetToken: string): void;
}
