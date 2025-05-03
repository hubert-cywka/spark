import { IsString, MinLength } from "class-validator";

import { MIN_PASSWORD_LENGTH } from "@/modules/identity/shared/constants";

export class UpdatePasswordDto {
    @IsString()
    readonly passwordChangeToken!: string;

    @IsString()
    @MinLength(MIN_PASSWORD_LENGTH)
    readonly password!: string;
}
