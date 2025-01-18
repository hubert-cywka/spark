import styles from "./styles/EntryGoalsList.module.scss";

import { Spinner } from "@/components/Spinner";
import { GoalLinkItem } from "@/features/entries/components/EntryGoalsList/components/GoalLinkItem/GoalLinkItem";
import { useEntryGoalsListEvents } from "@/features/entries/components/EntryGoalsList/hooks/useEntryGoalsListEvents";
import { useGoals } from "@/features/goals/hooks/useGoals/useGoals";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

type DailyEntryGoalsListProps = {
    entryId: string;
};

// TODO: Search
export const EntryGoalsList = ({ entryId }: DailyEntryGoalsListProps) => {
    const t = useTranslate();

    const { data: linkedGoalsData, isLoading: areLinkedGoalsLoading } = useGoals({ entries: [entryId] });
    const linkedGoals = linkedGoalsData?.pages.flatMap((page) => page.data) ?? [];

    const { data: unlinkedGoalsData, isLoading: areUnlinkedGoalsLoading } = useGoals({ excludeEntries: [entryId], name: "", pageSize: 5 });
    const unlinkedGoals = unlinkedGoalsData?.pages.flatMap((page) => page.data) ?? [];

    const { onLink, onUnlink } = useEntryGoalsListEvents({ entryId });

    if (areLinkedGoalsLoading || areUnlinkedGoalsLoading) {
        return <Spinner />;
    }

    return (
        <div className={styles.container}>
            <div>
                <p className={styles.header}>{t("entries.goals.list.linked.header")}</p>
                {!linkedGoals.length && <p className={styles.caption}>{t("entries.goals.list.linked.noResultsCaption")}</p>}

                <ul className={styles.list}>
                    {linkedGoals.map((goal) => (
                        <GoalLinkItem onClick={() => onUnlink(goal.id)} name={goal.name} linked key={goal.id} />
                    ))}
                </ul>
            </div>

            <div>
                <p className={styles.header}>{t("entries.goals.list.unlinked.header")}</p>
                {!unlinkedGoals.length && <p className={styles.caption}>{t("entries.goals.list.unlinked.noResultsCaption")}</p>}

                <ul className={styles.list}>
                    {unlinkedGoals.map((goal) => (
                        <GoalLinkItem onClick={() => onLink(goal.id)} name={goal.name} key={goal.id} />
                    ))}
                </ul>
            </div>
        </div>
    );
};
