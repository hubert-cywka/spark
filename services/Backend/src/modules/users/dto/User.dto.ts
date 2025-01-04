import { IsString } from "class-validator";

export class UserDto {
    @IsString()
    readonly id!: string;

    @IsString()
    readonly email!: string;

    @IsString()
    readonly firstName!: string;

    @IsString()
    readonly lastName!: string;
}
