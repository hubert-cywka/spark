import { IsEmail, IsString } from "class-validator";

export class AccountDto {
    @IsEmail()
    readonly email: string;

    @IsString()
    readonly id: string;

    @IsString()
    readonly providerId: string;

    @IsString()
    readonly providerAccountId: string;

    constructor({
        email,
        id,
        providerAccountId,
        providerId,
    }: {
        email: string;
        id: string;
        providerId: string;
        providerAccountId: string;
    }) {
        this.email = email;
        this.id = id;
        this.providerId = providerId;
        this.providerAccountId = providerAccountId;
    }
}
