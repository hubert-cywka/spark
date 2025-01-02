import { IsUUID } from "class-validator";

export class UUIDDto {
    @IsUUID()
    id!: string;
}
