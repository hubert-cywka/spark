import { DataExportScopeDomain } from "@/common/export/types/DataExportScopeDomain";
import { ISODateStringRange } from "@/types/Date";

export type DataExportScope = {
    domain: DataExportScopeDomain;
    dateRange: ISODateStringRange;
};
