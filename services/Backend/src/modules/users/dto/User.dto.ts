import { IsString } from "class-validator";

export class UserDto {
    @IsString()
    readonly id: string;

    @IsString()
    readonly email: string;

    @IsString()
    readonly firstName: string;

    @IsString()
    readonly lastName: string;

    constructor({ id, email, firstName, lastName }: { id: string; email: string; firstName: string; lastName: string }) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
