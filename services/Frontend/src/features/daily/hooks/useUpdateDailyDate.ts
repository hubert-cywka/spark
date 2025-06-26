import { InfiniteData, useMutation } from "@tanstack/react-query";

import { PageDto } from "@/api/dto/PageDto";
import { DailyService } from "@/features/daily/api/dailyService";
import { Daily } from "@/features/daily/types/Daily";
import { DailyInsightsQueryKeyFactory } from "@/features/daily/utils/dailyInsightsQueryKeyFactory.ts";
import { DailyQueryKeyFactory } from "@/features/daily/utils/dailyQueryKeyFactory";
import { EntriesQueryKeyFactory } from "@/features/entries/utils/entriesQueryKeyFactory.ts";
import { useQueryCache } from "@/hooks/useQueryCache";

const queryKey = DailyQueryKeyFactory.createForAll();

export const useUpdateDailyDate = () => {
    const { update, revert, invalidate } = useQueryCache();

    return useMutation({
        mutationFn: DailyService.updateDate,
        onMutate: async (variables) => {
            return await update<InfiniteData<PageDto<Daily>>>(queryKey, (previousData) => {
                if (!previousData) {
                    return;
                }

                const newPages =
                    previousData.pages.map((page) => {
                        return {
                            ...page,
                            data: page.data.map((daily) => {
                                if (daily.id !== variables.id) {
                                    return daily;
                                }

                                return {
                                    ...daily,
                                    date: variables.date,
                                };
                            }),
                        };
                    }) ?? [];

                return { ...previousData, pages: newPages };
            });
        },
        onError: async (_error, _variables, context) => {
            revert(context);
        },
        onSuccess: async () => {
            void invalidate(DailyInsightsQueryKeyFactory.createForAll());
            void invalidate(EntriesQueryKeyFactory.createForDetailed());
        },
    });
};
