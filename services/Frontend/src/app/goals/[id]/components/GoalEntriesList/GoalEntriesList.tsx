import styles from "./styles/GoalEntriesList.module.scss";

import { useDailyEntriesEvents } from "@/features/daily/components/DailyList/hooks/useDailyEntriesEvents";
import { useNavigationBetweenEntries } from "@/features/daily/components/DailyList/hooks/useNavigateBetweenEntries";
import { getEntryElementId } from "@/features/daily/components/DailyList/utils/dailyEntriesSelectors";
import { DailyEntry } from "@/features/entries/components/DailyEntry";
import { Entry } from "@/features/entries/types/Entry";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

type GoalEntriesListProps = {
    entries: Entry[];
    goalId: string;
};

// TODO: Handle loading state
export const GoalEntriesList = ({ entries, goalId }: GoalEntriesListProps) => {
    const t = useTranslate();

    const { onUpdateEntryContent, onDeleteEntry, onUpdateEntryStatus, onUpdateEntryIsFeatured } = useDailyEntriesEvents();
    const { navigateByIndex } = useNavigationBetweenEntries({
        entriesGroups: { [goalId]: entries },
    });

    return (
        <div className={styles.container}>
            <h2 className={styles.header}>{t("goal.entries.header")}</h2>
            {!entries.length && t("goal.entries.noResults")}

            <ul className={styles.entries}>
                {entries.map((entry, index) => (
                    <DailyEntry
                        id={getEntryElementId(entry.id)}
                        entry={entry}
                        key={entry.id}
                        onDelete={onDeleteEntry}
                        onChangeStatus={onUpdateEntryStatus}
                        onSaveContent={onUpdateEntryContent}
                        onChangeIsFeatured={onUpdateEntryIsFeatured}
                        onFocusColumn={(column) => navigateByIndex(column, goalId, index)}
                        onNavigateDown={(column) => navigateByIndex(column, goalId, index + 1)}
                        onNavigateUp={(column) => navigateByIndex(column, goalId, index - 1)}
                    />
                ))}
            </ul>
        </div>
    );
};
