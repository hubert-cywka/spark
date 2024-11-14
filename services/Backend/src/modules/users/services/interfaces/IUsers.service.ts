import { type User } from "@/modules/users/models/User.model";

export const IUsersServiceToken = Symbol("IUsersServiceToken");

export interface IUsersService {
    create(user: User): Promise<User>;
    activate(id: string): Promise<User>;
    findOneById(id: string): Promise<User>;
}
