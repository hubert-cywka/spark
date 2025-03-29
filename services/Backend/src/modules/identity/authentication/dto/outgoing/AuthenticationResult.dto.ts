import { IsArray, IsObject, IsString } from "class-validator";

import { AccessScope } from "@/common/types/AccessScope";
import { AccountDto } from "@/modules/identity/shared/dto/Account.dto";

export class AuthenticationResultDto {
    @IsObject()
    readonly account!: AccountDto;

    @IsString()
    readonly accessToken!: string;

    @IsArray()
    readonly accessScopes!: AccessScope[];
}
