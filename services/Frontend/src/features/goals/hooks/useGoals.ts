import { useInfiniteQuery } from "@tanstack/react-query";

import { GoalsService } from "@/features/goals/api/goalsService";
import { GoalsQueryFilters } from "@/features/goals/api/types/GoalsQueryFilters";
import { GoalQueryKeyFactory } from "@/features/goals/utils/goalQueryKeyFactory";
import { getNextPage, getPreviousPage } from "@/lib/queryClient/pagination";

export const useGoals = (filters: GoalsQueryFilters = {}) => {
    const queryKey = GoalQueryKeyFactory.createForFiltered(filters);

    return useInfiniteQuery({
        queryKey,
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => await GoalsService.getPage(pageParam, filters),
        getNextPageParam: getNextPage,
        getPreviousPageParam: getPreviousPage,
    });
};
