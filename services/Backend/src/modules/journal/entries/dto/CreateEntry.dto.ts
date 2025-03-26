import { IsBoolean, IsOptional } from "class-validator";

import { UpdateEntryContentDto } from "@/modules/journal/entries/dto/UpdateEntryContent.dto";

export class CreateEntryDto extends UpdateEntryContentDto {
    @IsBoolean()
    @IsOptional()
    isFeatured?: boolean;

    @IsBoolean()
    @IsOptional()
    isCompleted?: boolean;
}
