import { InfiniteData, useMutation } from "@tanstack/react-query";

import { GoalsService } from "@/features/goals/api/goalsService";
import { Goal } from "@/features/goals/types/Goal";
import { GoalQueryKeyFactory } from "@/features/goals/utils/goalQueryKeyFactory";
import { useOptimisticUpdate } from "@/hooks/useOptimisticUpdate";

const queryKey = GoalQueryKeyFactory.createForAll();

export const useUpdateGoalsDeadline = () => {
    const { update, revert } = useOptimisticUpdate();

    return useMutation({
        mutationFn: GoalsService.updateDeadline,
        onMutate: async (variables) => {
            await update<InfiniteData<Goal[]>>(queryKey, ({ pages, pageParams }) => {
                const newPages =
                    pages.map((page) =>
                        page.map((goal) => {
                            if (goal.id !== variables.id) {
                                return goal;
                            }

                            const deadline = variables.deadline ? new Date(variables.deadline) : null;
                            return { ...goal, deadline };
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
