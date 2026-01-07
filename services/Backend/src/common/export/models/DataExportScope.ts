import { DataExportScopeDomain } from "@/common/export/types/DataExportScopeDomain";
import { DateRange } from "@/types/Date";

export type DataExportScope = {
    domain: DataExportScopeDomain;
    dateRange: DateRange;
};
