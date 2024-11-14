export const IAccountPublisherServiceToken = Symbol("IAccountPublisherServiceToken");

export interface IAccountPublisherService {
    onAccountActivated(email: string, id: string): void;
    onAccountActivationTokenRequested(email: string, activationToken: string): void;
    onPasswordResetRequested(email: string, passwordResetToken: string): void;
    onPasswordUpdated(email: string, id: string): void;
}
