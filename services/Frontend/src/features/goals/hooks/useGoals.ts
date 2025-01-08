import { useInfiniteQuery } from "@tanstack/react-query";

import { GoalsService } from "@/features/goals/api/goalsService";
import { GoalQueryKeyFactory } from "@/features/goals/utils/goalQueryKeyFactory";
import { getNextPage, getPreviousPage } from "@/lib/queryClient/pagination";

const queryKey = GoalQueryKeyFactory.createForAll();

export const useGoals = () => {
    return useInfiniteQuery({
        queryKey,
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => await GoalsService.getPage(pageParam),
        getNextPageParam: getNextPage,
        getPreviousPageParam: getPreviousPage,
    });
};
