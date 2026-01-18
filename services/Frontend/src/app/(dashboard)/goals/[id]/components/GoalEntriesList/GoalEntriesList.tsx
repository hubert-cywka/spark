import { ReactNode } from "react";

import styles from "./styles/GoalEntriesList.module.scss";

import { useNavigationBetweenEntries } from "@/features/daily/components/DailyList/hooks/useNavigateBetweenEntries";
import { getEntryElementId } from "@/features/daily/components/DailyList/utils/dailyEntriesSelectors";
import { DailyEntry } from "@/features/entries/components/DailyEntry";
import { EntriesListSkeleton } from "@/features/entries/components/EntriesListSkeleton";
import { useEntriesEvents } from "@/features/entries/hooks/useEntriesEvents";
import { Entry } from "@/features/entries/types/Entry";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

type GoalEntriesListProps = {
    entries: Entry[];
    isLoading?: boolean;
    goalId: string;
    headerActions?: ReactNode;
};

export const GoalEntriesList = ({ entries, isLoading, goalId, headerActions }: GoalEntriesListProps) => {
    const t = useTranslate();

    const { onUpdateEntryContent, onDeleteEntry, onUpdateEntryStatus, onUpdateEntryIsFeatured, onUpdateEntryDate } = useEntriesEvents();
    const { navigateByIndex } = useNavigationBetweenEntries({
        entriesGroups: { [goalId]: entries },
    });

    return (
        <section className={styles.container}>
            <header className={styles.headerWrapper}>
                <h2 className={styles.header}>{t("goal.entries.header")}</h2>
                {headerActions}
            </header>

            {isLoading && <EntriesListSkeleton />}
            {!isLoading && !entries.length && t("goal.entries.noResults")}

            <ul className={styles.entries}>
                {entries.map((entry, index) => (
                    <DailyEntry
                        id={getEntryElementId(entry.id)}
                        entry={entry}
                        key={entry.id}
                        onDelete={onDeleteEntry}
                        onChangeStatus={onUpdateEntryStatus}
                        onChangeDate={onUpdateEntryDate}
                        onSaveContent={onUpdateEntryContent}
                        onChangeIsFeatured={onUpdateEntryIsFeatured}
                        onFocusColumn={(column) => navigateByIndex(column, goalId, index)}
                        onNavigateDown={(column) => navigateByIndex(column, goalId, index + 1)}
                        onNavigateUp={(column) => navigateByIndex(column, goalId, index - 1)}
                    />
                ))}
            </ul>
        </section>
    );
};
