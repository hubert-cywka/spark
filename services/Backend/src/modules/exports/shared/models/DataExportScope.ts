import { DataExportScopeDomain } from "@/modules/exports/shared/types/DataExportScopeDomain";
import { DateRange } from "@/types/Date";

export type DataExportScope = {
    domain: DataExportScopeDomain;
    dateRange: DateRange;
};
