import { IsEmail, IsString } from "class-validator";

export class AccountDto {
    @IsEmail()
    email!: string;

    @IsString()
    id!: string;

    @IsString()
    providerId!: string;

    @IsString()
    providerAccountId!: string;
}
