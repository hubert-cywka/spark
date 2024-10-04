import { IsString, Matches } from "class-validator";

import { PASSWORD_REGEX } from "@/common/constants/passwordRegex";

export class UpdatePasswordDto {
    @IsString()
    passwordChangeToken!: string;

    @IsString()
    @Matches(PASSWORD_REGEX)
    password!: string;
}
