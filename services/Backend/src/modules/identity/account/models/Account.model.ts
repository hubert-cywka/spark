import { IsEmail, IsString } from "class-validator";

export class Account {
    @IsString()
    id!: string;

    @IsEmail()
    email!: string;
}
