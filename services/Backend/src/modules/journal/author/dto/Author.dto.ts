import { IsUUID } from "class-validator";

export class AuthorDto {
    @IsUUID()
    readonly id: string;

    constructor({ id }: { id: string }) {
        this.id = id;
    }
}
