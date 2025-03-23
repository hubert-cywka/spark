import { InfiniteData, useMutation } from "@tanstack/react-query";

import { PageDto } from "@/api/dto/PageDto";
import { DailyInsightsQueryKeyFactory } from "@/features/daily/utils/dailyInsightsQueryKeyFactory";
import { EntriesService } from "@/features/entries/api/entriesService";
import { Entry } from "@/features/entries/types/Entry";
import { EntriesQueryKeyFactory } from "@/features/entries/utils/entriesQueryKeyFactory";
import { GoalQueryKeyFactory } from "@/features/goals/utils/goalQueryKeyFactory";
import { useQueryCache } from "@/hooks/useQueryCache";

const queryKey = EntriesQueryKeyFactory.createForAll();

export const useUpdateEntryStatus = () => {
    const { revert, update, invalidate } = useQueryCache();

    return useMutation({
        mutationFn: EntriesService.updateStatus,
        onMutate: async ({ entryId, isCompleted }) => {
            return await update<InfiniteData<PageDto<Entry>>>(queryKey, ({ pages, pageParams }) => {
                const newPages =
                    pages.map((page) => {
                        return {
                            ...page,
                            data: page.data.map((entry) => (entry.id === entryId ? { ...entry, isCompleted } : entry)),
                        };
                    }) ?? [];
                return { pageParams, pages: newPages };
            });
        },
        onError: (_error, _variables, context) => {
            revert(context);
        },
        onSuccess: () => {
            void invalidate(DailyInsightsQueryKeyFactory.createForAll());
            void invalidate(GoalQueryKeyFactory.createForAll());
        },
    });
};
