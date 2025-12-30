import { DataExportScope } from "@/features/export/types/DataExport";

export type StartDataExportDto = {
    targetScopes: DataExportScope[];
};
