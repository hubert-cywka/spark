import { IsObject, IsString } from "class-validator";

import { AccountDto } from "@/modules/identity/authentication/dto/Account.dto";

export class AuthenticationResultDto {
    @IsObject()
    account!: AccountDto;

    @IsString()
    accessToken!: string;
}
