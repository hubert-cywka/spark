import { useMutation } from "@tanstack/react-query";

import { GoalsService } from "@/features/goals/api/goalsService";
import { GoalQueryKeyFactory } from "@/features/goals/utils/goalQueryKeyFactory";
import { useQueryCache } from "@/hooks/useQueryCache";

const queryKey = GoalQueryKeyFactory.createForAll();

export const useCreateGoal = () => {
    const { invalidate } = useQueryCache();

    return useMutation({
        mutationFn: GoalsService.createOne,
        onSuccess: async () => await invalidate(queryKey),
    });
};
