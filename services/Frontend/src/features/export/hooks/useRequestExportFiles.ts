import { useMutation } from "@tanstack/react-query";

import { ExportService } from "@/features/export/api/exportService.ts";

export const useRequestExportFiles = () => {
    return useMutation({
        mutationFn: ExportService.download,
    });
};
