import { User } from "@/modules/auth/models/User.model";

export const IUserPublisherServiceToken = Symbol("IUserPublisherServiceToken");

export interface IUserPublisherService {
    onUserActivated(user: User): void;
    onUserActivationTokenRequested(email: string, activationToken: string): void;
    onPasswordResetRequested(email: string, passwordResetToken: string): void;
}
