import { Inject } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";

import { UserObject } from "@/modules/users/objects/User.object";
import { IUsersService, IUsersServiceToken } from "@/modules/users/services/interfaces/IUsers.service";

@Resolver(UserObject)
export class UsersResolver {
    constructor(@Inject(IUsersServiceToken) private usersService: IUsersService) {}

    // TODO: Add data loader
    @Query((returns) => UserObject)
    async user(@Args("id", { type: () => String }) id: string): Promise<UserObject> {
        return await this.usersService.findOneById(id);
    }
}
