import { DataExportScope } from "@/features/export/types/DataExport";

export type DataExportEntryDto = {
    id: string;
    targetScopes: DataExportScope[];
    startedAt: string;
    completedAt: string | null;
    cancelledAt: string | null;
};
