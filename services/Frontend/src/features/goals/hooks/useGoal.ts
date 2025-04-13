import { useQuery } from "@tanstack/react-query";

import { GoalsService } from "@/features/goals/api/goalsService";
import { GoalQueryKeyFactory } from "@/features/goals/utils/goalQueryKeyFactory";

type UseGoalOptions = {
    goalId: string;
};

export const useGoal = ({ goalId }: UseGoalOptions) => {
    const queryKey = GoalQueryKeyFactory.createForOne(goalId);

    return useQuery({
        queryKey,
        queryFn: async () => await GoalsService.getOne(goalId),
    });
};
