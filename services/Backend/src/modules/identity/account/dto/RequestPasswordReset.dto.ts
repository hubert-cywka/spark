import { IsEmail } from "class-validator";

export class RequestPasswordResetDto {
    @IsEmail()
    readonly email: string;

    constructor(email: string) {
        this.email = email;
    }
}
