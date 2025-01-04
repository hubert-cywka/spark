import { IsObject, IsString } from "class-validator";

import { AccountDto } from "@/modules/identity/authentication/dto/Account.dto";

export class AuthenticationResultDto {
    @IsObject()
    readonly account: AccountDto;

    @IsString()
    readonly accessToken: string;

    constructor({ account, accessToken }: { accessToken: string; account: AccountDto }) {
        this.account = account;
        this.accessToken = accessToken;
    }
}
