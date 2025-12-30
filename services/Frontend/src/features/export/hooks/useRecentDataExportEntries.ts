import { useQuery } from "@tanstack/react-query";

import { ExportService } from "@/features/export/api/exportService.ts";
import { ExportsQueryKeyFactory } from "@/features/export/utils/exportsQueryKeyFactory.ts";

export const useRecentDataExportEntries = () => {
    return useQuery({
        queryFn: ExportService.getMostRecentOnes,
        queryKey: ExportsQueryKeyFactory.createForRecentOnes(),
    });
};
