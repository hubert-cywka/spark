import { IsEmail } from "class-validator";

export class RequestActivationTokenDto {
    @IsEmail()
    readonly email!: string;
}
