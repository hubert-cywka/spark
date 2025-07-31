import { IsEmail, IsEnum, IsString } from "class-validator";

import { FederatedAccountProvider } from "@/modules/identity/authentication/types/ManagedAccountProvider";

export class ExternalIdentityDto {
    @IsEmail()
    readonly email!: string;

    @IsString()
    readonly id!: string;

    @IsEnum(FederatedAccountProvider)
    readonly providerId!: FederatedAccountProvider;
}
