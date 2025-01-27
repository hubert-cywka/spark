import { IsObject, IsString } from "class-validator";

import { AccountDto } from "@/modules/identity/shared/dto/Account.dto";

export class AuthenticationResultDto {
    @IsObject()
    readonly account!: AccountDto;

    @IsString()
    readonly accessToken!: string;
}
