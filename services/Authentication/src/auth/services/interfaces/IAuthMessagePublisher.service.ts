import { User } from "@/user/models/User.model";

export const IAuthMessagePublisherServiceToken = Symbol("IAuthMessagePublisherServiceToken");

export interface IAuthMessagePublisherService {
    onUserRegistered(user: User, activationToken: string): void;
    onUserActivated(user: User): void;
}
