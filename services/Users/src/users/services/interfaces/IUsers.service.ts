import { User } from "@/users/models/User";

export const IUsersServiceToken = Symbol("IUsersServiceToken");

export interface IUsersService {
    create(id: string, email: string): Promise<User>;
    activate(id: string): Promise<User>;
    findOneById(id: string): Promise<User>;
}
