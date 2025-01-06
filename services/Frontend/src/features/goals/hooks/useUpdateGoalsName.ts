import { InfiniteData, useMutation } from "@tanstack/react-query";

import { GoalsService } from "@/features/goals/api/goalsService";
import { Goal } from "@/features/goals/types/Goal";
import { GoalQueryKeyFactory } from "@/features/goals/utils/goalQueryKeyFactory";
import { useOptimisticUpdate } from "@/hooks/useOptimisticUpdate";

const queryKey = GoalQueryKeyFactory.createForAll();

export const useUpdateGoalsName = () => {
    const { update, revert } = useOptimisticUpdate();

    return useMutation({
        mutationFn: GoalsService.updateName,
        onMutate: async (variables) => {
            await update<InfiniteData<Goal[]>>(queryKey, ({ pages, pageParams }) => {
                const newPages =
                    pages.map((page) =>
                        page.map((goal) => {
                            if (goal.id !== variables.id) {
                                return goal;
                            }

                            return { ...goal, name: variables.name };
                        })
                    ) ?? [];

                return { pages: newPages, pageParams };
            });
        },
        onError: (_error, _variables, context) => {
            revert(queryKey, context);
        },
    });
};
