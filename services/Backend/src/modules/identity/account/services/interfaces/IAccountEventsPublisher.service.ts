export const AccountEventsPublisherToken = Symbol("AccountEventsPublisher");

export interface IAccountEventsPublisher {
    onAccountCreated(tenantId: string, email: string): Promise<void>;

    onAccountActivated(tenantId: string, email: string): Promise<void>;
    onAccountActivationTokenRequested(tenantId: string, email: string, accountActivationRedirectUrl: string): Promise<void>;

    onPasswordResetRequested(tenantId: string, passwordResetRedirectUrl: string): Promise<void>;
    onPasswordUpdated(tenantId: string): Promise<void>;
    onAccountSuspended(tenantId: string): Promise<void>;
}
