import { IsEmail, IsEnum, IsString } from "class-validator";

import { AccountProvider } from "@/modules/identity/authentication/types/AccountProvider";

export class Account {
    @IsString()
    id!: string;

    @IsEnum(AccountProvider)
    providerId!: AccountProvider;

    @IsString()
    providerAccountId!: string;

    @IsEmail()
    email!: string;
}
