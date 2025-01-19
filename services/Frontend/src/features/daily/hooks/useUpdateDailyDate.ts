import { InfiniteData, QueryKey, useMutation } from "@tanstack/react-query";

import { PageDto } from "@/api/dto/PageDto";
import { DailyService } from "@/features/daily/api/dailyService";
import { Daily } from "@/features/daily/types/Daily";
import { useQueryCache } from "@/hooks/useQueryCache";

// TODO: Update or invalidate cache

type UseUpdateDailyDateOptions = {
    queryKey?: QueryKey;
};

export const useUpdateDailyDate = ({ queryKey }: UseUpdateDailyDateOptions) => {
    const { update, revert } = useQueryCache();

    return useMutation({
        mutationFn: DailyService.updateDate,
        onMutate: async (variables) => {
            if (!queryKey) {
                return;
            }

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
            if (!queryKey) {
                return;
            }

            await revert(queryKey, context);
        },
    });
};
