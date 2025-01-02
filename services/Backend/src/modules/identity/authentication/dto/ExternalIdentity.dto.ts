import { IsEmail, IsEnum, IsString } from "class-validator";

import { FederatedAccountProvider } from "@/modules/identity/authentication/types/ManagedAccountProvider";

export class ExternalIdentityDto {
    @IsString()
    readonly firstName: string;

    @IsString()
    readonly lastName: string;

    @IsEmail()
    readonly email: string;

    @IsString()
    readonly id: string;

    @IsEnum(FederatedAccountProvider)
    readonly providerId: FederatedAccountProvider;

    constructor({
        firstName,
        lastName,
        id,
        email,
        providerId,
    }: {
        firstName: string;
        lastName: string;
        email: string;
        id: string;
        providerId: FederatedAccountProvider;
    }) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.id = id;
        this.providerId = providerId;
    }
}
