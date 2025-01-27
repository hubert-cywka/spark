import { IsEmail, IsString, IsUUID } from "class-validator";

export class AccountDto {
    @IsEmail()
    readonly email!: string;

    @IsUUID("4")
    readonly id!: string;

    @IsString()
    readonly providerId!: string;

    @IsString()
    readonly providerAccountId!: string;
}
