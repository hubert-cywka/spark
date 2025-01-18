import { useLinkEntryWithGoal, useUnlinkEntryFromGoal } from "@/features/entries/hooks";
import { useLinkEntryWithGoalEvents } from "@/features/entries/hooks/useEntryLink/useLinkEntryWithGoalEvents";
import { useUnlinkEntryFromGoalEvents } from "@/features/entries/hooks/useEntryLink/useUnlinkEntryFromGoalEvents";

type UseEntryGoalsListEventsOptions = {
    entryId: string;
};

export const useEntryGoalsListEvents = ({ entryId }: UseEntryGoalsListEventsOptions) => {
    const { onUnlinkEntryError } = useUnlinkEntryFromGoalEvents();
    const { mutateAsync: unlink } = useUnlinkEntryFromGoal();

    const { onLinkEntryError } = useLinkEntryWithGoalEvents();
    const { mutateAsync: link } = useLinkEntryWithGoal();

    const onUnlink = async (goalId: string) => {
        try {
            await unlink({ entryId, goalId });
        } catch (err) {
            onUnlinkEntryError(err);
        }
    };

    const onLink = async (goalId: string) => {
        try {
            await link({ entryId, goalId });
        } catch (err) {
            onLinkEntryError(err);
        }
    };

    return { onLink, onUnlink };
};
