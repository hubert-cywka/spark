import { Expose } from "class-transformer";
import { IsEmail, IsString } from "class-validator";

export class AccountDto {
    @Expose()
    @IsEmail()
    email!: string;

    @Expose()
    @IsString()
    id!: string;

    @Expose()
    @IsString()
    providerId!: string;

    @Expose()
    @IsString()
    providerAccountId!: string;
}
