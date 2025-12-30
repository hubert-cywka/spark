import { useInfiniteQuery } from "@tanstack/react-query";

import { DailyService } from "@/features/daily/api/dailyService";
import { DailyQueryKeyFactory } from "@/features/daily/utils/dailyQueryKeyFactory";
import { useAutoFetch } from "@/hooks/useAutoFetch.ts";
import { getNextCursor } from "@/lib/queryClient/pagination";
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

    const { hasNextPage, fetchNextPage, isFetchingNextPage, ...rest } = useInfiniteQuery({
        queryKey,
        initialPageParam: null,
        queryFn: async ({ pageParam }) => await DailyService.getPage(filters.from, filters.to, pageParam),
        getNextPageParam: getNextCursor,
        staleTime: 0, // TODO: Can this be optimized?
    });

    useAutoFetch({
        shouldFetch: !!autoFetch && hasNextPage && !isFetchingNextPage,
        fetch: fetchNextPage,
    });

    return {
        hasNextPage,
        fetchNextPage,
        ...rest,
        queryKey,
    };
};
