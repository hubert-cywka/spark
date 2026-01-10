import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsUUID, ValidateNested } from "class-validator";

import { UpdateEntryDto } from "@/modules/journal/entries/dto/UpdateEntry.dto";

export class BulkUpdateEntryDto {
    @IsArray()
    @IsUUID("4", { each: true })
    @ArrayMinSize(1)
    @ArrayMaxSize(500)
    readonly ids!: string[];

    @ValidateNested()
    @Type(() => UpdateEntryDto)
    readonly value!: UpdateEntryDto;
}
