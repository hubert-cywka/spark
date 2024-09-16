import { Args, Query, Resolver, ResolveReference } from "@nestjs/graphql";

import { User } from "@/users/objects/User";

@Resolver(User)
export class UsersResolver {
    constructor() {}

    @Query((returns) => User, { nullable: true })
    async user(@Args("id", { type: () => String }) id: string) {
        return null;
    }

    @ResolveReference()
    resolveReference(reference: { __typename: string; id: string }): User | null {
        return null;
    }
}
