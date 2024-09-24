import { IsString } from "class-validator";

export class ConfirmRegistrationDto {
    @IsString()
    confirmationToken!: string;
}
