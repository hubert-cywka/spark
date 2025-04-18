import { IsEmail, IsString } from "class-validator";

export class RequestPasswordResetDto {
    @IsEmail()
    readonly email!: string;

    @IsString()
    readonly redirectUrl!: string;
}
