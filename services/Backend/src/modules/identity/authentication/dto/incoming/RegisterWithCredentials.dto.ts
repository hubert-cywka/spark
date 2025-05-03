import { Equals, IsBoolean, IsEmail, IsString, MinLength } from "class-validator";

import { PASSWORD_LENGTH } from "@/modules/identity/shared/constants";

export class RegisterWithCredentialsDto {
    @IsEmail()
    readonly email!: string;

    @IsString()
    @MinLength(PASSWORD_LENGTH)
    readonly password!: string;

    @IsBoolean()
    @Equals(true)
    readonly hasAcceptedTermsAndConditions!: boolean;

    @IsString()
    readonly accountActivationRedirectUrl!: string;
}
