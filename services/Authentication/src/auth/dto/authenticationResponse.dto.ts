import { IsInstance, IsString } from "class-validator";

import { User } from "@/user/models/user.model";

export class AuthenticationResponseDto {
    @IsInstance(User)
    user!: User;

    @IsString()
    token!: string;
}
