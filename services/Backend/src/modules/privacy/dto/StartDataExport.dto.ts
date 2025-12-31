import { ArrayMaxSize, ArrayMinSize, IsArray, IsObject } from "class-validator";

import { DataExportScopeDto } from "@/modules/privacy/dto/DataExportScope.dto";

export class StartDataExportDto {
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(15)
    @IsObject({ each: true })
    readonly targetScopes!: DataExportScopeDto[];
}
