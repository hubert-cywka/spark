import { useMutation } from "@tanstack/react-query";

import { DailyService } from "@/features/daily/api/dailyService";
import { DailyQueryKeyFactory } from "@/features/daily/utils/dailyQueryKeyFactory";
import { EntriesQueryKeyFactory } from "@/features/entries/utils/entriesQueryKeyFactory.ts";
import { useQueryCache } from "@/hooks/useQueryCache";

export const useDeleteDaily = () => {
    const { invalidate } = useQueryCache();

    return useMutation({
        mutationFn: DailyService.deleteOne,
        onSuccess: () => {
            void invalidate(DailyQueryKeyFactory.createForAll());
            void invalidate(EntriesQueryKeyFactory.createForDetailed());
        },
    });
};
