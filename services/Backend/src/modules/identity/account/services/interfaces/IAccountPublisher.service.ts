export const AccountPublisherServiceToken = Symbol("AccountPublisherServiceToken");

export interface IAccountPublisherService {
    onAccountCreated(tenantId: string, email: string): Promise<void>;

    onAccountActivated(tenantId: string, email: string): Promise<void>;
    onAccountActivationTokenRequested(tenantId: string, email: string, accountActivationRedirectUrl: string): Promise<void>;

    onPasswordResetRequested(tenantId: string, email: string, passwordResetRedirectUrl: string): Promise<void>;
    onPasswordUpdated(tenantId: string, email: string): Promise<void>;
    onAccountSuspended(tenantId: string): Promise<void>;
}
