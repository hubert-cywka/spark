export const AccountPublisherServiceToken = Symbol("AccountPublisherServiceToken");

export interface IAccountPublisherService {
    onAccountActivated(tenantId: string, email: string): Promise<void>;
    onAccountActivationTokenRequested(tenantId: string, email: string, activationToken: string): Promise<void>;
    onPasswordResetRequested(tenantId: string, email: string, passwordResetToken: string): Promise<void>;
    onPasswordUpdated(tenantId: string, email: string): Promise<void>;
    onAccountSuspended(tenantId: string): Promise<void>;
}
