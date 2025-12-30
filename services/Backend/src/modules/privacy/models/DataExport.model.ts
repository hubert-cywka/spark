import { DataExportScope } from "@/common/export/models/DataExportScope";

export type DataExport = {
    id: string;
    targetScopes: DataExportScope[];
    startedAt: Date;
    cancelledAt: Date | null;
    completedAt: Date | null;
};
