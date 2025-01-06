import { useInfiniteQuery } from "@tanstack/react-query";

import { GoalsService } from "@/features/goals/api/goalsService";
import { GoalQueryKeyFactory } from "@/features/goals/utils/goalQueryKeyFactory";

const queryKey = GoalQueryKeyFactory.createForAll();

export const useGoals = () => {
    return useInfiniteQuery({
        queryKey,
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => await GoalsService.getPage(pageParam),
        getNextPageParam: (lastPage) => Math.min(lastPage.meta.page + 1, lastPage.meta.pageCount),
        getPreviousPageParam: (lastPage) => Math.max(lastPage.meta.page - 1, 0),
    });
};
