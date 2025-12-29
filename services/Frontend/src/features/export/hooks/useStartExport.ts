import { useMutation } from "@tanstack/react-query";

import { ExportService } from "@/features/export/api/exportService.ts";
import { ExportsQueryKeyFactory } from "@/features/export/utils/exportsQueryKeyFactory.ts";
import { useQueryCache } from "@/hooks/useQueryCache";

const queryKey = ExportsQueryKeyFactory.createForAll();

export const useStartExport = () => {
    const { invalidate } = useQueryCache();

    return useMutation({
        mutationFn: ExportService.start,
        onSuccess: async () => {
            await invalidate(queryKey);
        },
    });
};
