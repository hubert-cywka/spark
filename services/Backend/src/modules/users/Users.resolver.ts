import { Inject } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";

import { UserObject } from "@/modules/users/objects/User.object";
import { type IUsersService, UsersServiceToken } from "@/modules/users/services/interfaces/IUsers.service";

@Resolver(UserObject)
export class UsersResolver {
    constructor(@Inject(UsersServiceToken) private usersService: IUsersService) {}

    // TODO: Remove GraphQL completely, REST will be good enough
    @Query((returns) => UserObject)
    async user(@Args("id", { type: () => String }) id: string): Promise<UserObject> {
        return await this.usersService.findOneById(id);
    }
}
