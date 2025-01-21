"use client";

import styles from "./styles/Entries.module.scss";

import { AppRoute } from "@/app/appRoute";
import { Breadcrumbs } from "@/components/Breadcrumbs/Breadcrumbs";
import { useDailyEntriesEvents } from "@/features/daily/components/DailyList/hooks/useDailyEntriesEvents";
import { DailyEntryColumn, useNavigationBetweenEntries } from "@/features/daily/components/DailyList/hooks/useNavigateBetweenEntries";
import { getEntryElementId } from "@/features/daily/components/DailyList/utils/dailyEntriesSelectors";
import { DailyEntry } from "@/features/entries/components/DailyEntry";
import { useEntries } from "@/features/entries/hooks";
import { GoalCard } from "@/features/goals/components/GoalCard";
import { useGoal } from "@/features/goals/hooks/useGoals/useGoal";

type EntriesProps = {
    goalId: string;
};

export const Entries = ({ goalId }: EntriesProps) => {
    const { data, queryKey } = useEntries({ goals: [goalId] });
    const entries = data?.pages.flatMap((page) => page.data) ?? [];

    const { navigateByIndex } = useNavigationBetweenEntries({
        entriesGroups: { [goalId]: entries },
    });

    const { onUpdateEntryContent, onDeleteEntry, onUpdateEntryStatus } = useDailyEntriesEvents({
        queryKey,
    });

    const { data: goal } = useGoal({ goalId });

    return (
        <>
            <Breadcrumbs items={[{ label: "Goals", href: AppRoute.GOALS }, { label: goal?.name ?? "" }]} />
            <div>
                {goal && <GoalCard goal={goal} />}

                <div className={styles.container}>
                    <h2 style={{ fontSize: "1.5rem", marginTop: 30 }}>Entries</h2>
                    <ul className={styles.entries}>
                        {entries.map((entry, index) => (
                            <DailyEntry
                                id={getEntryElementId(entry.id)}
                                entry={entry}
                                key={entry.id}
                                onDelete={onDeleteEntry}
                                onChangeStatus={onUpdateEntryStatus}
                                onSaveContent={onUpdateEntryContent}
                                onFocusColumn={(column: DailyEntryColumn) => navigateByIndex(column, goalId, index)}
                                onNavigateDown={(target) => navigateByIndex(target, goalId, index + 1)}
                                onNavigateUp={(target) => navigateByIndex(target, goalId, index - 1)}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};
