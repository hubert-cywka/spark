import { User } from "@/user/models/User.model";

export const IUserServiceToken = Symbol("IUserService");

export interface IUserService {
    save(email: string, password: string): Promise<{ user: User; activationToken: string }>;
    activate(activationToken: string): Promise<User>;
    findByCredentials(email: string, password: string): Promise<User>;
}
