import { IsEmail, IsString } from "class-validator";

export class RecipientDto {
    @IsString()
    readonly id!: string;

    @IsEmail()
    readonly email!: string;
}
