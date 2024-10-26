import { Equals, IsBoolean, IsEmail, IsString, Matches, MinLength } from "class-validator";

import { PASSWORD_LENGTH, USER_NAME_REGEX } from "@/modules/identity/shared/constants";

export class RegisterDto {
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(PASSWORD_LENGTH)
    password!: string;

    @IsString()
    @Matches(USER_NAME_REGEX)
    lastName!: string;

    @IsString()
    @Matches(USER_NAME_REGEX)
    firstName!: string;

    @IsBoolean()
    @Equals(true)
    hasAcceptedTermsAndConditions!: boolean;
}
