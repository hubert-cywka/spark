import { IsBoolean, IsString } from "class-validator";

export class UserDto {
    @IsString()
    readonly id!: string;

    @IsString()
    readonly email!: string;

    @IsBoolean()
    readonly isActivated!: boolean;
}
