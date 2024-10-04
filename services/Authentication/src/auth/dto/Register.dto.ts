import { Equals, IsBoolean, IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(8)
    @MaxLength(256)
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
