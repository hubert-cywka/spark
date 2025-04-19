import { IsEmail, IsString } from "class-validator";

export class RequestActivationTokenDto {
    @IsEmail()
    readonly email!: string;

    @IsString()
    readonly redirectUrl!: string;
}
