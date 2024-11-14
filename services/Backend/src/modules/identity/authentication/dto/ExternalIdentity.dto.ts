import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";

import { FederatedAccountProvider } from "@/modules/identity/authentication/types/ManagedAccountProvider";

export class ExternalIdentityDto {
    @IsString()
    @IsNotEmpty()
    firstName!: string;

    @IsString()
    @IsNotEmpty()
    lastName!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    id!: string;

    @IsEnum(FederatedAccountProvider)
    @IsNotEmpty()
    providerId!: FederatedAccountProvider;
}
