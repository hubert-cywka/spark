import { IsBoolean, IsDateString, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

import { IsDateOnly } from "@/lib/validation";
import type { ISODateString } from "@/types/Date";

export class UpdateEntryDto {
    @IsOptional()
    @IsDateOnly()
    @IsDateString({ strict: true })
    readonly date?: ISODateString;

    @IsOptional()
    @IsString()
    @MaxLength(1024)
    @MinLength(1)
    content?: string;

    @IsBoolean()
    @IsOptional()
    isFeatured?: boolean;

    @IsBoolean()
    @IsOptional()
    isCompleted?: boolean;
}
