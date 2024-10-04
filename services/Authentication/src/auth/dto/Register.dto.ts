import { Equals, IsBoolean, IsEmail, IsString, Matches, MaxLength } from "class-validator";

import { PASSWORD_REGEX } from "@/common/constants/passwordRegex";

export class RegisterDto {
    @IsEmail()
    email!: string;

    @IsString()
    @Matches(PASSWORD_REGEX)
    password!: string;

    @IsString()
    @MaxLength(30)
    lastName!: string;

    @IsString()
    @MaxLength(30)
    firstName!: string;

    @IsBoolean()
    @Equals(true)
    hasAcceptedTermsAndConditions!: boolean;
}
