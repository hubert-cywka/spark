import { IsBoolean, IsEmail, IsString } from "class-validator";

import { FederatedAccountProvider, ManagedAccountProvider } from "@/modules/identity/authentication/types/ManagedAccountProvider";

export class Account {
    @IsString()
    id!: string;

    @IsString()
    providerId!: ManagedAccountProvider | FederatedAccountProvider;

    @IsString()
    providerAccountId!: string;

    @IsEmail()
    email!: string;

    @IsBoolean()
    sudoMode!: boolean;
}
