import { IsEmail, IsString } from "class-validator";

export class User {
    @IsString()
    id!: string;

    @IsEmail()
    email!: string;
}
