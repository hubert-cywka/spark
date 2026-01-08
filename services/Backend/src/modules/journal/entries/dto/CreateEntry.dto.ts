import { IsBoolean, IsDateString, IsOptional } from "class-validator";

import { IsDateOnly } from "@/lib/validation";
import { UpdateEntryContentDto } from "@/modules/journal/entries/dto/UpdateEntryContent.dto";
import type { ISODateString } from "@/types/Date";

export class CreateEntryDto extends UpdateEntryContentDto {
    @IsDateOnly()
    @IsDateString({ strict: true })
    readonly date!: ISODateString;

    @IsBoolean()
    @IsOptional()
    isFeatured?: boolean;

    @IsBoolean()
    @IsOptional()
    isCompleted?: boolean;
}
