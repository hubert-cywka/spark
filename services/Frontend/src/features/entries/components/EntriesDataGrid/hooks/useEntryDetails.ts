import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { EntriesService } from "@/features/entries/api/entriesService.ts";
import { EntriesQueryKeyFactory } from "@/features/entries/utils/entriesQueryKeyFactory.ts";
import { useAutoFetch } from "@/hooks/useAutoFetch.ts";
import { getNextCursor } from "@/lib/queryClient/pagination.ts";
import { ISODateString } from "@/types/ISODateString";

type UseEntryDetailsOptions = {
    filters: {
        content?: string;
        completed?: boolean;
        featured?: boolean;
        from: ISODateString;
        to: ISODateString;
    };
    autoFetch?: boolean;
};

export const useEntryDetails = ({ filters, autoFetch }: UseEntryDetailsOptions) => {
    const queryKey = EntriesQueryKeyFactory.createForDetailed(filters);

    const { hasNextPage, fetchNextPage, isFetchingNextPage, data, ...rest } = useInfiniteQuery({
        queryKey,
        initialPageParam: null,
        queryFn: async ({ pageParam }) => await EntriesService.getDetailedPage(pageParam, filters),
        getNextPageParam: getNextCursor,
    });

    useAutoFetch({
        shouldFetch: !!autoFetch && hasNextPage && !isFetchingNextPage,
        fetch: fetchNextPage,
    });

    const flatData = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data?.pages]);

    return {
        hasNextPage,
        fetchNextPage,
        data: flatData,
        ...rest,
        queryKey,
    };
};
