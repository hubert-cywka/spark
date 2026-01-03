import { useQuery } from "@tanstack/react-query";

import { ExportService } from "@/features/export/api/exportService.ts";
import { ExportsQueryKeyFactory } from "@/features/export/utils/exportsQueryKeyFactory.ts";

// TODO: Use SSE to get updates on active exports.
export const useRecentDataExportEntries = () => {
    return useQuery({
        queryFn: ExportService.getMostRecentOnes,
        queryKey: ExportsQueryKeyFactory.createForRecentOnes(),
    });
};
