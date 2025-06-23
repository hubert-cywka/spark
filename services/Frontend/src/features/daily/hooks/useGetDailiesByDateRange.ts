import { useInfiniteQuery } from "@tanstack/react-query";

import { DailyService } from "@/features/daily/api/dailyService";
import { DailyQueryKeyFactory } from "@/features/daily/utils/dailyQueryKeyFactory";
import { useAutoFetch } from "@/hooks/useAutoFetch.ts";
import { getNextPage, getPreviousPage } from "@/lib/queryClient/pagination";
import { ISODateString } from "@/types/ISODateString";

type UseGetDailiesByDateRangeOptions = {
    filters: {
        from: ISODateString;
        to: ISODateString;
    };
    autoFetch?: boolean;
};

export const useGetDailiesByDateRange = ({ filters, autoFetch }: UseGetDailiesByDateRangeOptions) => {
    const queryKey = DailyQueryKeyFactory.createForDateRange(filters.from, filters.to);

    const { hasNextPage, fetchNextPage, ...rest } = useInfiniteQuery({
        queryKey,
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => await DailyService.getPage(filters.from, filters.to, pageParam),
        getNextPageParam: getNextPage,
        getPreviousPageParam: getPreviousPage,
        staleTime: 0, // TODO: Can this be optimized?
    });

    useAutoFetch({
        shouldFetch: !!autoFetch && hasNextPage,
        fetch: fetchNextPage,
    });

    return {
        hasNextPage,
        fetchNextPage,
        ...rest,
        queryKey,
    };
};
