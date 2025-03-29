import { IsEnum, IsString } from "class-validator";

import { SudoAuthorizationMethod } from "@/modules/identity/authorization/types/SudoAuthorizationMethod";

export class SudoEnableRequestResponseDto {
    @IsString()
    readonly url!: string;

    @IsEnum(SudoAuthorizationMethod)
    readonly strategy!: SudoAuthorizationMethod;
}
