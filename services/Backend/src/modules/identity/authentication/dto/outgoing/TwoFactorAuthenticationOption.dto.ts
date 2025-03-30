import { IsDateString, IsEnum, IsUUID } from "class-validator";

import { IsNullable } from "@/lib/validation";
import { TwoFactorAuthenticationMethod } from "@/modules/identity/authentication/types/TwoFactorAuthenticationMethod";

export class TwoFactorAuthenticationOptionDto {
    @IsUUID("4")
    id!: string;

    @IsEnum(TwoFactorAuthenticationMethod)
    method!: TwoFactorAuthenticationMethod;

    @IsDateString()
    createdAt!: string;

    @IsDateString()
    updatedAt!: string;

    @IsDateString()
    @IsNullable()
    enabledAt!: string | null;
}
