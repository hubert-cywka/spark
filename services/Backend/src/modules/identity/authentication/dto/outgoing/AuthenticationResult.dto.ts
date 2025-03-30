import { IsArray, IsObject, IsString } from "class-validator";

import { AccessScope } from "@/common/types/AccessScope";
import { AccountDto } from "@/modules/identity/shared/dto/Account.dto";

export class AccessScopesDto {
    @IsArray()
    readonly active!: AccessScope[];

    @IsArray()
    readonly inactive!: AccessScope[];
}

export class AuthenticationResultDto {
    @IsObject()
    readonly account!: AccountDto;

    @IsString()
    readonly accessToken!: string;

    @IsObject()
    readonly accessScopes!: AccessScopesDto;
}
