import { IsEmail, IsEnum, IsString } from "class-validator";

import { ManagedAccountProvider } from "@/modules/identity/authentication/types/ManagedAccountProvider";

export class Account {
    @IsString()
    id!: string;

    @IsEnum(ManagedAccountProvider)
    providerId!: ManagedAccountProvider;

    @IsString()
    providerAccountId!: string;

    @IsEmail()
    email!: string;
}
