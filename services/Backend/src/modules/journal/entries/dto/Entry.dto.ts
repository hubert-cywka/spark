import { IsBoolean, IsDateString, IsString, IsUUID } from "class-validator";

export class EntryDto {
    @IsUUID("4")
    id!: string;

    @IsUUID("4")
    authorId!: string;

    @IsUUID("4")
    dailyId!: string;

    @IsString()
    content!: string;

    @IsBoolean()
    isCompleted!: boolean;

    @IsBoolean()
    isFeatured!: boolean;

    @IsDateString()
    createdAt!: string;

    @IsDateString()
    updatedAt!: string;
}
