import { useInfiniteQuery } from "@tanstack/react-query";

import { EntriesService } from "@/features/entries/api/entriesService";
import { EntriesQueryFilters } from "@/features/entries/api/types/EntriesQueryFilters";
import { EntriesQueryKeyFactory } from "@/features/entries/utils/entriesQueryKeyFactory";
import { useAutoFetch } from "@/hooks/useAutoFetch.ts";
import { getNextPage, getPreviousPage } from "@/lib/queryClient/pagination";

type UseEntriesOptions = { autoFetch?: boolean; filters: EntriesQueryFilters };

export const useEntries = ({ autoFetch, filters }: UseEntriesOptions) => {
    const queryKey = EntriesQueryKeyFactory.createForFiltered(filters);

    const { hasNextPage, fetchNextPage, ...rest } = useInfiniteQuery({
        queryKey,
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => await EntriesService.getPage(pageParam, filters),
        getNextPageParam: getNextPage,
        getPreviousPageParam: getPreviousPage,
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
