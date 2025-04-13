import { type User } from "@/modules/users/models/User.model";

export const UsersServiceToken = Symbol("IUsersServiceToken");

export interface IUsersService {
    create(user: Omit<User, "isActivated">): Promise<User>;
    activate(id: string): Promise<User>;
    findOneById(id: string): Promise<User>;
    remove(id: string): Promise<void>;
}
