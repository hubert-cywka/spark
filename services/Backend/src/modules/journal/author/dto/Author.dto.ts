import { IsUUID } from "class-validator";

export class AuthorDto {
    @IsUUID()
    readonly id!: string;
}
