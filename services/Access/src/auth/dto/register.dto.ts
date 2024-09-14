import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(8)
    @MaxLength(256)
    password!: string;

    @IsString()
    @MinLength(3)
    @MaxLength(40)
    name!: string;
}
