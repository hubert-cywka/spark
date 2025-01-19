import { InfiniteData, useMutation } from "@tanstack/react-query";

import { PageDto } from "@/api/dto/PageDto";
import { GoalsService } from "@/features/goals/api/goalsService";
import { Goal } from "@/features/goals/types/Goal";
import { GoalQueryKeyFactory } from "@/features/goals/utils/goalQueryKeyFactory";
import { useQueryCache } from "@/hooks/useQueryCache";

const queryKey = GoalQueryKeyFactory.createForAll();

export const useUpdateGoal = () => {
    const { update, revert } = useQueryCache();

    return useMutation({
        mutationFn: GoalsService.updateOne,
        onMutate: async (variables) => {
            return await update<InfiniteData<PageDto<Goal>>>(queryKey, ({ pages, pageParams }) => {
                const newPages =
                    pages.map((page) => {
                        return {
                            ...page,
                            data: page.data.map((goal) => {
                                if (goal.id !== variables.id) {
                                    return goal;
                                }

                                const deadline = variables.deadline ? new Date(variables.deadline) : null;
                                return {
                                    ...goal,
                                    name: variables.name,
                                    target: variables.target,
                                    isAccomplished: goal.targetProgress >= goal.target,
                                    deadline,
                                };
                            }),
                        };
                    }) ?? [];

                return { pages: newPages, pageParams };
            });
        },
        onError: (_error, _variables, context) => {
            revert(queryKey, context);
        },
    });
};
