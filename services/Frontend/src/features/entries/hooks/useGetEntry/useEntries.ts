import { useInfiniteQuery } from "@tanstack/react-query";

import { EntriesService } from "@/features/entries/api/entriesService";
import { EntriesQueryFilters } from "@/features/entries/api/types/EntriesQueryFilters";
import { EntriesQueryKeyFactory } from "@/features/entries/utils/entriesQueryKeyFactory";
import { useAutoFetch } from "@/hooks/useAutoFetch.ts";
import { getNextCursor } from "@/lib/queryClient/pagination";

type UseEntriesOptions = { autoFetch?: boolean; filters: EntriesQueryFilters };

export const useEntries = ({ autoFetch, filters }: UseEntriesOptions) => {
    const queryKey = EntriesQueryKeyFactory.createForFiltered(filters);

    const { hasNextPage, fetchNextPage, isFetchingNextPage, ...rest } = useInfiniteQuery({
        queryKey,
        initialPageParam: null,
        queryFn: async ({ pageParam }) => await EntriesService.getPage(pageParam, filters),
        getNextPageParam: getNextCursor,
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
