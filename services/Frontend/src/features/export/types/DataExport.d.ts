type DateRange = {
    from: Date;
    to: Date;
};

export type DataExportStatus = "pending" | "cancelled" | "completed";

export type DataExportScopeDomain = "entries" | "goals";

export type DataExportScope = {
    domain: DataExportScopeDomain;
    dateRange: DateRange;
};

export type DataExportEntry = {
    id: string;
    targetScopes: DataExportScope[];
    startedAt: Date;
    status: DataExportStatus;
};
