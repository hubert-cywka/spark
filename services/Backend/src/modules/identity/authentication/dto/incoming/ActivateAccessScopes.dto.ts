import { IsArray, IsEnum } from "class-validator";

import { AccessScope } from "@/common/types/AccessScope";
import { IsArrayUnique } from "@/lib/validation/decorators/IsArrayUnique.decorator";
import { Verify2FACodeDto } from "@/modules/identity/authentication/dto/incoming/Verify2FACode.dto";
import { TwoFactorAuthenticationMethod } from "@/modules/identity/authentication/types/TwoFactorAuthenticationMethod";

export class ActivateAccessScopesDto extends Verify2FACodeDto {
    @IsEnum(TwoFactorAuthenticationMethod)
    readonly method!: TwoFactorAuthenticationMethod;

    @IsArray()
    @IsArrayUnique()
    scopes!: AccessScope[];
}
