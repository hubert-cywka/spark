import { IsUUID } from "class-validator";

export class AuthorDto {
    @IsUUID("4")
    readonly id!: string;
}
