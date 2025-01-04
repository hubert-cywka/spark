import { IsString, MinLength } from "class-validator";

import { PASSWORD_LENGTH } from "@/modules/identity/shared/constants";

export class UpdatePasswordDto {
    @IsString()
    readonly passwordChangeToken: string;

    @IsString()
    @MinLength(PASSWORD_LENGTH)
    readonly password: string;

    constructor({ passwordChangeToken, password }: { passwordChangeToken: string; password: string }) {
        this.passwordChangeToken = passwordChangeToken;
        this.password = password;
    }
}
