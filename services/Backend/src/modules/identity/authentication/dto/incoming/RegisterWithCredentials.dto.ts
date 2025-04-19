import { Equals, IsBoolean, IsEmail, IsString, Matches, MinLength } from "class-validator";

import { PASSWORD_LENGTH, USER_NAME_REGEX } from "@/modules/identity/shared/constants";

export class RegisterWithCredentialsDto {
    @IsEmail()
    readonly email!: string;

    @IsString()
    @MinLength(PASSWORD_LENGTH)
    readonly password!: string;

    @IsString()
    @Matches(USER_NAME_REGEX)
    readonly lastName!: string;

    @IsString()
    @Matches(USER_NAME_REGEX)
    readonly firstName!: string;

    @IsBoolean()
    @Equals(true)
    readonly hasAcceptedTermsAndConditions!: boolean;

    @IsString()
    readonly accountActivationRedirectUrl!: string;
}
