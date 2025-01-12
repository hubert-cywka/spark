import { InfiniteData, useMutation } from "@tanstack/react-query";

import { PageDto } from "@/api/dto/PageDto";
import { GoalsService } from "@/features/goals/api/goalsService";
import { Goal } from "@/features/goals/types/Goal";
import { GoalQueryKeyFactory } from "@/features/goals/utils/goalQueryKeyFactory";
import { useQueryCache } from "@/hooks/useQueryCache";

const queryKey = GoalQueryKeyFactory.createForAll();

export const useDeleteGoal = () => {
    const { update, revert } = useQueryCache();

    return useMutation({
        mutationFn: GoalsService.deleteOne,
        onMutate: async (goalId) => {
            return await update<InfiniteData<PageDto<Goal>>>(queryKey, ({ pages, pageParams }) => {
                const newPages =
                    pages.map((page) => {
                        return {
                            ...page,
                            data: page.data.filter((goal) => goal.id !== goalId),
                        };
                    }) ?? [];
                return { pageParams, pages: newPages };
            });
        },
        onError: (_error, _variables, context) => {
            revert(queryKey, context);
        },
    });
};
