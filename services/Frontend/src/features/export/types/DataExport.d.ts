import { ISODateStringRange } from "@/types/ISODateString";

export type DataExportStatus = "pending" | "cancelled" | "completed";

export type DataExportScopeDomain = "entries" | "goals";

export type DataExportScope = {
    domain: DataExportScopeDomain;
    dateRange: ISODateStringRange;
};

export type DataExportEntry = {
    id: string;
    targetScopes: DataExportScope[];
    startedAt: Date;
    status: DataExportStatus;
};
