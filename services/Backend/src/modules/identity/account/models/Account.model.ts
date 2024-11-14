import { IsEmail, IsString } from "class-validator";

import { FederatedAccountEntity } from "@/modules/identity/account/entities/FederatedAccountEntity";
import { ManagedAccountProvider } from "@/modules/identity/authentication/types/ManagedAccountProvider";

export class Account {
    @IsString()
    id!: string;

    @IsString()
    providerId!: ManagedAccountProvider | FederatedAccountEntity;

    @IsString()
    providerAccountId!: string;

    @IsEmail()
    email!: string;
}
