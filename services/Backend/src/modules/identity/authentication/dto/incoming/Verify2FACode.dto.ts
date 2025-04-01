import { IsString, Length } from "class-validator";

import { TOTP_LENGTH } from "@/modules/identity/authentication/constants";

export class Verify2FACodeDto {
    @IsString()
    @Length(TOTP_LENGTH)
    readonly code!: string;
}
