import { useMutation } from "@tanstack/react-query";

import { EntriesLinkService } from "@/features/entries/api/entriesLinkService";
import { EntriesQueryKeyFactory } from "@/features/entries/utils/entriesQueryKeyFactory.ts";
import { GoalQueryKeyFactory } from "@/features/goals/utils/goalQueryKeyFactory";
import { useQueryCache } from "@/hooks/useQueryCache";

export const useLinkEntryWithGoal = () => {
    const { invalidate } = useQueryCache();

    return useMutation({
        mutationFn: EntriesLinkService.linkWithGoal,
        onSuccess: async () => {
            void invalidate(GoalQueryKeyFactory.createForAll());
            void invalidate(EntriesQueryKeyFactory.createForDetailed());
        },
    });
};
