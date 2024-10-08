import { IsString, MinLength } from "class-validator";

import { PASSWORD_LENGTH } from "@/auth/constants/passwordLength";

export class UpdatePasswordDto {
    @IsString()
    passwordChangeToken!: string;

    @IsString()
    @MinLength(PASSWORD_LENGTH)
    password!: string;
}
