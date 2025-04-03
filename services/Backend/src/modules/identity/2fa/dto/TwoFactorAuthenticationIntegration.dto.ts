import { IsDateString, IsEnum, IsNumber, IsUUID } from "class-validator";

import { IsNullable } from "@/lib/validation";
import { TwoFactorAuthenticationMethod } from "@/modules/identity/2fa/types/TwoFactorAuthenticationMethod";

export class TwoFactorAuthenticationIntegrationDto {
    @IsUUID("4")
    id!: string;

    @IsEnum(TwoFactorAuthenticationMethod)
    method!: TwoFactorAuthenticationMethod;

    @IsNumber()
    totpTTL!: number;

    @IsDateString()
    createdAt!: string;

    @IsDateString()
    updatedAt!: string;

    @IsDateString()
    @IsNullable()
    enabledAt!: string | null;
}
