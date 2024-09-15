import { Field, InputType, OmitType } from "@nestjs/graphql";
import { Type } from "class-transformer";

import { User } from "@/users/objects/user";

@InputType()
export class CreateUserInput extends OmitType(User, ["id"] as const) {
    @Field()
    @Type(() => String)
    password!: string;
}
