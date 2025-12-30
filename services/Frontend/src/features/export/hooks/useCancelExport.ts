import { useMutation } from "@tanstack/react-query";

import { ExportService } from "@/features/export/api/exportService.ts";
import { DataExportEntry } from "@/features/export/types/DataExport";
import { ExportsQueryKeyFactory } from "@/features/export/utils/exportsQueryKeyFactory.ts";
import { useQueryCache } from "@/hooks/useQueryCache";

const queryKey = ExportsQueryKeyFactory.createForAll();

export const useCancelExport = () => {
    const { update, revert } = useQueryCache();

    return useMutation({
        mutationFn: ExportService.cancel,
        onMutate: async (id) => {
            return await update<DataExportEntry[]>(queryKey, (entries) => {
                return entries.map((entry) => {
                    if (entry.id === id) {
                        return { ...entry, status: "cancelled" };
                    }

                    return entry;
                });
            });
        },
        onError: (_error, _variables, context) => {
            revert(context);
        },
    });
};
