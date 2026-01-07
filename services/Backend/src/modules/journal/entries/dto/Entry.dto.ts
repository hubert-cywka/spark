import { IsArray, IsBoolean, IsDateString, IsObject, IsOptional, IsString, IsUUID } from "class-validator";

import { ISODateString } from "@/types/Date";

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

    @IsOptional()
    @IsDateString()
    daily?: ISODateString;

    @IsOptional()
    @IsArray()
    @IsObject({ each: true })
    goals?: { id: string; name: string }[];
}
