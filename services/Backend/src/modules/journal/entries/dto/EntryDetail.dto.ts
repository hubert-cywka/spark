import { IsArray, IsBoolean, IsDateString, IsString, IsUUID } from "class-validator";

import type { ISODateString } from "@/types/Date";

export class EntryDetailDto {
    @IsUUID("4")
    id!: string;

    @IsDateString()
    daily!: ISODateString;

    @IsString()
    content!: string;

    @IsBoolean()
    isCompleted!: boolean;

    @IsBoolean()
    isFeatured!: boolean;

    @IsArray()
    @IsString({ each: true })
    goals!: string[];
}
