import { DataExportScope } from "@/modules/exports/shared/models/DataExportScope";

export type DataExport = {
    id: string;
    targetScopes: DataExportScope[];
    startedAt: Date;
    validUntil: Date;
    cancelledAt: Date | null;
    completedAt: Date | null;
};
