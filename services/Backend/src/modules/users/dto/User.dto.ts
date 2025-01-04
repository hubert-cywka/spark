import { IsString } from "class-validator";

export class UserDto {
    @IsString()
    id!: string;

    @IsString()
    email!: string;

    @IsString()
    firstName!: string;

    @IsString()
    lastName!: string;
}
