import { Directive, Field, ObjectType } from "@nestjs/graphql";
import { Type } from "class-transformer";

@ObjectType("user")
@Directive('@key(fields: "id")')
export class UserObject {
    @Field()
    @Type(() => String)
    id!: string;

    @Field()
    @Type(() => String)
    email!: string;

    @Field()
    @Type(() => String)
    firstName!: string;

    @Field()
    @Type(() => String)
    lastName!: string;

    @Field()
    @Type(() => Boolean)
    isActivated!: boolean;
}
