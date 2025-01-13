import { InfiniteData, QueryKey, useMutation } from "@tanstack/react-query";

import { PageDto } from "@/api/dto/PageDto";
import { DailyService } from "@/features/daily/api/dailyService";
import { Daily } from "@/features/daily/types/Daily";
import { useQueryCache } from "@/hooks/useQueryCache";

type UseCreateDailyOptions = {
    queryKey?: QueryKey;
};

export const useCreateDaily = ({ queryKey }: UseCreateDailyOptions) => {
    const { update } = useQueryCache();

    return useMutation({
        mutationFn: DailyService.createOne,
        onSuccess: async (createdDaily) => {
            if (!queryKey) {
                return;
            }

            return await update<InfiniteData<PageDto<Daily>>>(queryKey, ({ pages, pageParams }) => {
                const firstPage = pages[0];
                const newFirstPage = {
                    ...firstPage,
                    data: [createdDaily, ...firstPage.data],
                };
                return {
                    pageParams,
                    pages: [newFirstPage, ...pages.slice(1)],
                };
            });
        },
    });
};
