import { IsEnum, IsObject } from "class-validator";

import { DateRangeDto } from "@/modules/exports/dto/DateRange.dto";
import { DataExportScopeDomain } from "@/modules/exports/shared/types/DataExportScopeDomain";

export class DataExportScopeDto {
    @IsEnum(DataExportScopeDomain)
    readonly domain!: DataExportScopeDomain;

    @IsObject()
    readonly dateRange!: DateRangeDto;
}
