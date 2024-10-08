import { User } from "@/user/models/User.model";

export const IAuthPublisherServiceToken = Symbol("IAuthPublisherServiceToken");

export interface IAuthPublisherService {
    onUserRegistered(user: { lastName: string; firstName: string } & User): void;
}
