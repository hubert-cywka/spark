import { EntryGoalsListSection } from "@/features/entries/components/LinkGoalsPopover/components/EntryGoalsListSection/EntryGoalsListSection.tsx";
import { useLinkEntryWithGoal, useUnlinkEntryFromGoal } from "@/features/entries/hooks";
import { useLinkEntryWithGoalEvents } from "@/features/entries/hooks/useEntryLink/useLinkEntryWithGoalEvents.ts";
import { useUnlinkEntryFromGoalEvents } from "@/features/entries/hooks/useEntryLink/useUnlinkEntryFromGoalEvents.ts";
import { useGoals } from "@/features/goals/hooks/useGoals.ts";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type EntryGoalsListProps = {
    nameFilter: string;
    entryId: string;
};

export const EntryGoalsList = ({ nameFilter, entryId }: EntryGoalsListProps) => {
    const t = useTranslate();

    const { data: linkedGoals, isLoading: areLinkedGoalsLoading } = useGoals({
        filters: { entries: [entryId] },
        autoFetch: true,
    });

    const { data: unlinkedGoals, isLoading: areUnlinkedGoalsLoading } = useGoals({
        filters: {
            excludeEntries: [entryId],
            name: nameFilter,
            pageSize: 5,
        },
    });

    const { onLinkEntryError } = useLinkEntryWithGoalEvents();
    const { mutateAsync: link } = useLinkEntryWithGoal();

    const { onUnlinkEntryError } = useUnlinkEntryFromGoalEvents();
    const { mutateAsync: unlink } = useUnlinkEntryFromGoal();

    const onLink = async (goalId: string) => {
        try {
            await link({ entryId, goalId });
        } catch (err) {
            onLinkEntryError(err);
        }
    };

    const onUnlink = async (goalId: string) => {
        try {
            await unlink({ entryId, goalId });
        } catch (err) {
            onUnlinkEntryError(err);
        }
    };

    return (
        <>
            <EntryGoalsListSection
                goals={unlinkedGoals}
                onAction={onLink}
                areGoalsLoading={areUnlinkedGoalsLoading}
                header={t("entries.goals.list.unlinked.header")}
            />

            <EntryGoalsListSection
                linked
                goals={linkedGoals}
                onAction={onUnlink}
                areGoalsLoading={areLinkedGoalsLoading}
                header={t("entries.goals.list.linked.header")}
            />
        </>
    );
};
