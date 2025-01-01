export const IAccountPublisherServiceToken = Symbol("IAccountPublisherServiceToken");

export interface IAccountPublisherService {
    onAccountActivated(email: string, id: string): Promise<void>;
    onAccountActivationTokenRequested(email: string, activationToken: string): Promise<void>;
    onPasswordResetRequested(email: string, passwordResetToken: string): Promise<void>;
    onPasswordUpdated(email: string, id: string): Promise<void>;
}
