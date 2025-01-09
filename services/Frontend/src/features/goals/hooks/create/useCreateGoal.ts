import { useMutation } from "@tanstack/react-query";

import { GoalsService } from "@/features/goals/api/goalsService";
import { GoalQueryKeyFactory } from "@/features/goals/utils/goalQueryKeyFactory";
import { useOptimisticUpdate } from "@/hooks/useOptimisticUpdate";

const queryKey = GoalQueryKeyFactory.createForAll();

export const useCreateGoal = () => {
    const { invalidate } = useOptimisticUpdate();

    return useMutation({
        mutationFn: GoalsService.createOne,
        onSuccess: async () => await invalidate(queryKey),
    });
};
