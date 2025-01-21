"use client";

import { useMemo } from "react";
import dayjs from "dayjs";

import styles from "./styles/DailyList.module.scss";

import { ItemLoader } from "@/components/ItemLoader/ItemLoader";
import { DailyListHeader } from "@/features/daily/components/DailyList/components/DailyListHeader/DailyListHeader";
import { useDailiesEvents } from "@/features/daily/components/DailyList/hooks/useDailiesEvents";
import { useDailyDateRange } from "@/features/daily/components/DailyList/hooks/useDailyDateRange";
import { useDailyEntriesEvents } from "@/features/daily/components/DailyList/hooks/useDailyEntriesEvents";
import { useDailyEntriesPlaceholders } from "@/features/daily/components/DailyList/hooks/useDailyEntriesPlaceholders";
import { DailyEntryColumn, useNavigationBetweenEntries } from "@/features/daily/components/DailyList/hooks/useNavigateBetweenEntries";
import { getEntryElementId, getEntryPlaceholderElementId } from "@/features/daily/components/DailyList/utils/dailyEntriesSelectors";
import { DayHeader } from "@/features/daily/components/DayHeader/DayHeader";
import { DaySkeleton } from "@/features/daily/components/DaySkeleton";
import { useGetDailiesByDateRange } from "@/features/daily/hooks/useGetDailiesByDateRange";
import { getFormattedDailyDate } from "@/features/daily/utils/dateUtils";
import { DailyEntry, DailyEntryPlaceholder } from "@/features/entries/components/DailyEntry";
import { useGetDailyEntriesByDateRange } from "@/features/entries/hooks";

// TODO: Create dailies in more user-friendly way
// TODO: Improve UX of navigation between entries
export const DailyList = () => {
    const { setPrev, setNext, reset, endDate, startDate } = useDailyDateRange({
        granularity: "month",
    });

    const {
        data: dailyData,
        hasNextPage,
        fetchNextPage,
        isFetching,
        queryKey,
    } = useGetDailiesByDateRange({
        from: getFormattedDailyDate(startDate),
        to: getFormattedDailyDate(endDate),
    });

    const dailies = useMemo(() => dailyData?.pages?.flatMap((page) => page.data) ?? [], [dailyData?.pages]);

    const { data: entriesGroups } = useGetDailyEntriesByDateRange({
        from: getFormattedDailyDate(startDate),
        to: getFormattedDailyDate(endDate),
        autoFetch: true,
    });

    const { onCreateNewDaily, onUpdateDailyDate } = useDailiesEvents({
        queryKey,
        endDate,
        startDate,
    });

    const { onCreateEntry, onUpdateEntryContent, onDeleteEntry, onUpdateEntryStatus } = useDailyEntriesEvents();
    const { placeholders, addPlaceholder, removePlaceholder } = useDailyEntriesPlaceholders();

    const { navigateByIndex, navigateByEntryId } = useNavigationBetweenEntries({
        entriesGroups,
        onBottomLeft: removePlaceholder,
        onBottomReached: addPlaceholder,
    });

    const onSavePlaceholder = async (dailyId: string, content: string) => {
        const entry = await onCreateEntry(dailyId, content);

        if (entry) {
            navigateByEntryId("input", entry.id);
            removePlaceholder(dailyId);
        }
    };

    return (
        <main className={styles.container}>
            <DailyListHeader
                onCreateNewDaily={onCreateNewDaily}
                onNextTimeframe={setNext}
                onPrevTimeframe={setPrev}
                onReset={reset}
                timeframeStart={startDate}
            />

            {dailies.map((daily) => (
                <div className={styles.day} key={daily.id}>
                    <DayHeader daily={daily} onUpdateDate={onUpdateDailyDate} />
                    <ul className={styles.entries}>
                        {entriesGroups[daily.id]?.map((entry, index) => (
                            <DailyEntry
                                id={getEntryElementId(entry.id)}
                                entry={entry}
                                key={entry.id}
                                onDelete={onDeleteEntry}
                                onChangeStatus={onUpdateEntryStatus}
                                onSaveContent={onUpdateEntryContent}
                                onFocusColumn={(column: DailyEntryColumn) => navigateByIndex(column, daily.id, index)}
                                onNavigateDown={(target) => navigateByIndex(target, daily.id, index + 1)}
                                onNavigateUp={(target) => navigateByIndex(target, daily.id, index - 1)}
                            />
                        ))}

                        {(!entriesGroups[daily.id]?.length || placeholders.includes(daily.id)) && (
                            <DailyEntryPlaceholder
                                id={getEntryPlaceholderElementId(daily.id)}
                                onDelete={() => removePlaceholder(daily.id)}
                                onSaveContent={(content) => onSavePlaceholder(daily.id, content)}
                                onNavigateUp={() => navigateByIndex("input", daily.id, entriesGroups[daily.id]?.length - 1)}
                                onNavigateDown={() => navigateByIndex("input", daily.id, Infinity)}
                            />
                        )}
                    </ul>
                </div>
            ))}

            <ItemLoader shouldLoadNext={hasNextPage} onLoadNext={fetchNextPage}>
                {isFetching && dayjs().isAfter(startDate) && <DaySkeleton count={3} />}
            </ItemLoader>
        </main>
    );
};
