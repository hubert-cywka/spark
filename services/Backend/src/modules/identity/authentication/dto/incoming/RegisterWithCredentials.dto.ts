import { Equals, IsBoolean, IsEmail, IsString, MaxLength, MinLength } from "class-validator";

import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "@/modules/identity/shared/constants";

export class RegisterWithCredentialsDto {
    @IsEmail()
    readonly email!: string;

    @IsString()
    @MinLength(MIN_PASSWORD_LENGTH)
    @MaxLength(MAX_PASSWORD_LENGTH)
    readonly password!: string;

    @IsBoolean()
    @Equals(true)
    readonly hasAcceptedTermsAndConditions!: boolean;

    @IsString()
    readonly accountActivationRedirectUrl!: string;
}
