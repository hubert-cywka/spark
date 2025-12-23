import { type User } from "@/modules/users/models/User.model";

export const UsersServiceToken = Symbol("IUsersServiceToken");

export interface IUsersService {
    create(user: Omit<User, "isActivated">): Promise<User>;
    findOneById(id: string): Promise<User>;

    activateOneById(id: string): Promise<User>;
    requestRemovalById(id: string): Promise<void>;
    removeOneById(id: string): Promise<void>;
}
