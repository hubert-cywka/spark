import { IsEmail, IsEnum, IsString } from "class-validator";

import { FederatedAccountProvider } from "@/modules/identity/authentication/types/ManagedAccountProvider";

export class ExternalIdentityDto {
    @IsString()
    firstName!: string;

    @IsString()
    lastName!: string;

    @IsEmail()
    email!: string;

    @IsString()
    id!: string;

    @IsEnum(FederatedAccountProvider)
    providerId!: FederatedAccountProvider;
}
