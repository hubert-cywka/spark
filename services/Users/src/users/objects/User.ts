import { Directive, Field, ObjectType } from "@nestjs/graphql";
import { Type } from "class-transformer";

@ObjectType()
@Directive('@key(fields: "id")')
export class User {
    @Field()
    @Type(() => String)
    id!: string;

    @Field()
    @Type(() => String)
    email!: string;

    @Field()
    @Type(() => String)
    name!: string;
}
