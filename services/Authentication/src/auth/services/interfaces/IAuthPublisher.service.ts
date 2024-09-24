import { User } from "@/user/models/User.model";

export const IAuthPublisherServiceToken = Symbol("IAuthPublisherServiceToken");

export interface IAuthPublisherService {
    onUserRegistered(user: User): void;
}
