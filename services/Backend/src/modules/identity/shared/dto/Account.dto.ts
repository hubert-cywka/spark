import { IsEmail, IsString, IsUUID } from "class-validator";

export class AccountDto {
    @IsEmail()
    readonly email!: string;

    @IsUUID()
    readonly id!: string;

    @IsString()
    readonly providerId!: string;

    @IsString()
    readonly providerAccountId!: string;
}
