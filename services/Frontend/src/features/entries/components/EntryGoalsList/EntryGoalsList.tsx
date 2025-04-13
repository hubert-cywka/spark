import styles from "./styles/EntryGoalsList.module.scss";

import { ItemLoader } from "@/components/ItemLoader/ItemLoader";
import { Spinner } from "@/components/Spinner";
import { GoalLinkItem } from "@/features/entries/components/GoalLinkItem/GoalLinkItem";
import { LinkGoalsPopover } from "@/features/entries/components/LinkGoalsPopover/LinkGoalsPopover";
import { useUnlinkEntryFromGoal } from "@/features/entries/hooks";
import { useUnlinkEntryFromGoalEvents } from "@/features/entries/hooks/useEntryLink/useUnlinkEntryFromGoalEvents";
import { useGoals } from "@/features/goals/hooks/useGoals";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

type EntryGoalsListProps = {
    entryId: string;
};

export const EntryGoalsList = ({ entryId }: EntryGoalsListProps) => {
    const t = useTranslate();

    const { data: linkedGoalsData, hasNextPage, fetchNextPage, isFetching } = useGoals({ entries: [entryId] });
    const linkedGoals = linkedGoalsData?.pages.flatMap((page) => page.data) ?? [];

    const { onUnlinkEntryError } = useUnlinkEntryFromGoalEvents();
    const { mutateAsync: unlink } = useUnlinkEntryFromGoal();

    const onUnlink = async (goalId: string) => {
        try {
            await unlink({ entryId, goalId });
        } catch (err) {
            onUnlinkEntryError(err);
        }
    };

    return (
        <section className={styles.container}>
            <header className={styles.headerWrapper}>
                <h3 className={styles.header}>{t("entries.goals.list.linked.header")}</h3>
                <LinkGoalsPopover entryId={entryId} />
            </header>
            {!linkedGoals.length && <p className={styles.caption}>{t("entries.goals.list.linked.noResultsCaption")}</p>}

            <ul className={styles.list}>
                {linkedGoals.map((goal) => (
                    <GoalLinkItem onClick={() => onUnlink(goal.id)} name={goal.name} linked key={goal.id} />
                ))}
            </ul>

            <ItemLoader shouldLoadNext={hasNextPage} onLoadNext={fetchNextPage} isLoaderVisible={isFetching}>
                <Spinner size="1" />
            </ItemLoader>
        </section>
    );
};
