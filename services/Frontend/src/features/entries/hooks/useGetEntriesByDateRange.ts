import { useInfiniteQuery } from "@tanstack/react-query";

import { EntriesService } from "@/features/entries/api/entriesService";
import { EntriesQueryKeyFactory } from "@/features/entries/utils/entriesQueryKeyFactory";
import { getNextPage, getPreviousPage } from "@/lib/queryClient/pagination";

type UseGetEntriesByDateRangeOptions = {
    from: string;
    to: string;
};

export const useGetEntriesByDateRange = ({ from, to }: UseGetEntriesByDateRangeOptions) => {
    const queryKey = EntriesQueryKeyFactory.createForDateRange(from, to);

    return {
        ...useInfiniteQuery({
            queryKey,
            initialPageParam: 1,
            queryFn: async ({ pageParam }) => await EntriesService.getPageByDateRange(from, to, pageParam),
            getNextPageParam: getNextPage,
            getPreviousPageParam: getPreviousPage,
        }),
        queryKey,
    };
};
