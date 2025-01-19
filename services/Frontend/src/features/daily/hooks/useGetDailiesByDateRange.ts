import { useInfiniteQuery } from "@tanstack/react-query";

import { DailyService } from "@/features/daily/api/dailyService";
import { DailyQueryKeyFactory } from "@/features/daily/utils/dailyQueryKeyFactory";
import { getNextPage, getPreviousPage } from "@/lib/queryClient/pagination";

type UseGetDailiesByDateRangeOptions = {
    from: string;
    to: string;
};

export const useGetDailiesByDateRange = ({ from, to }: UseGetDailiesByDateRangeOptions) => {
    const queryKey = DailyQueryKeyFactory.createForDateRange(from, to);

    return {
        ...useInfiniteQuery({
            queryKey,
            initialPageParam: 1,
            queryFn: async ({ pageParam }) => await DailyService.getPage(from, to, pageParam),
            getNextPageParam: getNextPage,
            getPreviousPageParam: getPreviousPage,
            staleTime: 0, // TODO: Can this be optimized?
        }),
        queryKey,
    };
};
