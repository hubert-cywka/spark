import { IsEnum, IsObject } from "class-validator";

import { DataExportScopeDomain } from "@/common/export/types/DataExportScopeDomain";
import { DateRangeDto } from "@/modules/exports/dto/DateRange.dto";

export class DataExportScopeDto {
    @IsEnum(DataExportScopeDomain)
    readonly domain!: DataExportScopeDomain;

    @IsObject()
    readonly dateRange!: DateRangeDto;
}
