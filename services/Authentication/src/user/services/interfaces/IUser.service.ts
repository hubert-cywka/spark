import { User } from "@/user/models/User.model";

export const IUserServiceToken = Symbol("IUserService");

export interface IUserService {
    findByCredentials(email: string, password: string): Promise<User>;
    save(email: string, password: string): Promise<User>;
    requestActivation(email: string): Promise<void>;
    activate(activationToken: string): Promise<void>;
    requestPasswordChange(email: string): Promise<void>;
    updatePassword(passwordChangeToken: string, password: string): Promise<void>;
}
