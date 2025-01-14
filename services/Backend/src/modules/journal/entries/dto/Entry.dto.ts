import { IsDateString, IsString, IsUUID } from "class-validator";

export class EntryDto {
    @IsUUID("4")
    id!: string;

    @IsUUID("4")
    authorId!: string;

    @IsUUID("4")
    dailyId!: string;

    @IsString()
    content!: string;

    @IsDateString()
    createdAt!: string;

    @IsDateString()
    updatedAt!: string;
}
