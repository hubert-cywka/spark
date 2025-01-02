import { Expose } from "class-transformer";
import { IsObject, IsString } from "class-validator";

import { AccountDto } from "@/modules/identity/authentication/dto/Account.dto";

export class AuthenticationResultDto {
    @Expose()
    @IsObject()
    account!: AccountDto;

    @Expose()
    @IsString()
    accessToken!: string;
}
