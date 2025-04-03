import { IsArray, IsEnum } from "class-validator";

import { AccessScope } from "@/common/types/AccessScope";
import { IsArrayUnique } from "@/lib/validation/decorators/IsArrayUnique.decorator";
import { TwoFactorAuthenticationMethod } from "@/modules/identity/2fa/types/TwoFactorAuthenticationMethod";
import { Verify2FACodeDto } from "@/modules/identity/authentication/dto/incoming/Verify2FACode.dto";

export class ActivateAccessScopesDto extends Verify2FACodeDto {
    @IsEnum(TwoFactorAuthenticationMethod)
    readonly method!: TwoFactorAuthenticationMethod;

    @IsArray()
    @IsArrayUnique()
    scopes!: AccessScope[];
}
