import { IsEmail, IsString } from "class-validator";

export class LoginDto {
    @IsEmail()
    readonly email: string;

    @IsString()
    readonly password: string;

    constructor({ email, password }: { email: string; password: string }) {
        this.email = email;
        this.password = password;
    }
}
