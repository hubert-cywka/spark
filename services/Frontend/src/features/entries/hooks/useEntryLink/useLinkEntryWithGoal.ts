import { useMutation } from "@tanstack/react-query";

import { EntriesLinkService } from "@/features/entries/api/entriesLinkService";
import { GoalQueryKeyFactory } from "@/features/goals/utils/goalQueryKeyFactory";
import { useQueryCache } from "@/hooks/useQueryCache";

export const useLinkEntryWithGoal = () => {
    const { invalidate } = useQueryCache();

    return useMutation({
        mutationFn: EntriesLinkService.linkWithGoal,
        onSuccess: async () => await invalidate(GoalQueryKeyFactory.createForAll()),
    });
};
