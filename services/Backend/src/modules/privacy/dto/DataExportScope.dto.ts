import { IsEnum, IsObject } from "class-validator";

import { DataExportScopeDomain } from "@/common/export/types/DataExportScopeDomain";
import { DateRangeDto } from "@/modules/privacy/dto/DateRange.dto";

export class DataExportScopeDto {
    @IsEnum(DataExportScopeDomain)
    readonly domain!: DataExportScopeDomain;

    @IsObject()
    readonly dateRange!: DateRangeDto;
}
