import { IsString } from "class-validator";

export class RecipientDto {
    @IsString()
    readonly id!: string;

    @IsString()
    readonly email!: string;
}
