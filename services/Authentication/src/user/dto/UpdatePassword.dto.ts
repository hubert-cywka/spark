import { IsString, MinLength } from "class-validator";

export class UpdatePasswordDto {
    @IsString()
    passwordChangeToken!: string;

    @IsString()
    @MinLength(8)
    password!: string;
}
