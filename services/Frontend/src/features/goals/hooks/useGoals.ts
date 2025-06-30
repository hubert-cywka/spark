import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { GoalsService } from "@/features/goals/api/goalsService";
import { GoalsQueryFilters } from "@/features/goals/api/types/GoalsQueryFilters";
import { GoalQueryKeyFactory } from "@/features/goals/utils/goalQueryKeyFactory";
import { useAutoFetch } from "@/hooks/useAutoFetch.ts";
import { getNextPage, getPreviousPage } from "@/lib/queryClient/pagination";

type UseGoalsOptions = {
    filters?: GoalsQueryFilters;
    autoFetch?: boolean;
};

export const useGoals = ({ filters = {}, autoFetch }: UseGoalsOptions) => {
    const queryKey = GoalQueryKeyFactory.createForFiltered(filters);

    const { hasNextPage, fetchNextPage, data, ...rest } = useInfiniteQuery({
        queryKey,
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => await GoalsService.getPage(pageParam, filters),
        getNextPageParam: getNextPage,
        getPreviousPageParam: getPreviousPage,
    });

    useAutoFetch({
        shouldFetch: !!autoFetch && hasNextPage,
        fetch: fetchNextPage,
    });

    const flatData = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data?.pages]);

    return { hasNextPage, fetchNextPage, data: flatData, ...rest, queryKey };
};
