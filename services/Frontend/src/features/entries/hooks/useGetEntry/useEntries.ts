import { useInfiniteQuery } from "@tanstack/react-query";

import { EntriesService } from "@/features/entries/api/entriesService";
import { EntriesQueryFilters } from "@/features/entries/api/types/EntriesQueryFilters";
import { EntriesQueryKeyFactory } from "@/features/entries/utils/entriesQueryKeyFactory";
import { getNextPage, getPreviousPage } from "@/lib/queryClient/pagination";

export const useEntries = (filters: EntriesQueryFilters) => {
    const queryKey = EntriesQueryKeyFactory.createForFiltered(filters);

    return {
        ...useInfiniteQuery({
            queryKey,
            initialPageParam: 1,
            queryFn: async ({ pageParam }) => await EntriesService.getPage(pageParam, filters),
            getNextPageParam: getNextPage,
            getPreviousPageParam: getPreviousPage,
        }),
        queryKey,
    };
};
