import { useMutation } from "@tanstack/react-query";

import { EntriesQueryKeyFactory } from "@/features/entries/utils/entriesQueryKeyFactory.ts";
import { GoalsService } from "@/features/goals/api/goalsService";
import { GoalQueryKeyFactory } from "@/features/goals/utils/goalQueryKeyFactory";
import { useQueryCache } from "@/hooks/useQueryCache";

export const useDeleteGoal = () => {
    const { invalidate } = useQueryCache();

    return useMutation({
        mutationFn: GoalsService.deleteOne,
        onSuccess: async () => {
            void invalidate(GoalQueryKeyFactory.createForAll());
            void invalidate(EntriesQueryKeyFactory.createForDetailed());
        },
    });
};
