import { IsEmail } from "class-validator";

export class RequestActivationTokenDto {
    @IsEmail()
    email!: string;
}
