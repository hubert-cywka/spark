import { IsEmail } from "class-validator";

export class RequestActivationTokenDto {
    @IsEmail()
    readonly email: string;

    constructor({ email }: { email: string }) {
        this.email = email;
    }
}
