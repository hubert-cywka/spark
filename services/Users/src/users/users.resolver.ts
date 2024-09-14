import { Args, Query, Resolver, ResolveReference } from "@nestjs/graphql";

import { User } from "@/users/objects/user";
import { UsersService } from "@/users/users.service";

@Resolver(User)
export class UsersResolver {
    constructor(private usersService: UsersService) {}

    @Query((returns) => User, { nullable: true })
    async user(@Args("id", { type: () => String }) id: string) {
        return this.usersService.findOneById(id);
    }

    @ResolveReference()
    resolveReference(reference: { __typename: string; id: string }): Promise<User | null> {
        return this.usersService.findOneById(reference.id);
    }
}
