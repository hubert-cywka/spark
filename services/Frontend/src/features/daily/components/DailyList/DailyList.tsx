"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";

import styles from "./styles/DailyList.module.scss";

import { ItemLoader } from "@/components/ItemLoader/ItemLoader";
import { DailyActivityChart } from "@/features/daily/components/DailyActivityChart/DailyActivityChart.tsx";
import { DailyListHeader } from "@/features/daily/components/DailyList/components/DailyListHeader/DailyListHeader";
import { NoEntriesMessage } from "@/features/daily/components/DailyList/components/NoEntriesMessage/NoEntriesMessage.tsx";
import { useDailyDateRange } from "@/features/daily/components/DailyList/hooks/useDailyDateRange";
import { useDailyEntriesPlaceholders } from "@/features/daily/components/DailyList/hooks/useDailyEntriesPlaceholders";
import { useEntriesEvents } from "@/features/daily/components/DailyList/hooks/useEntriesEvents.ts";
import { DailyEntryColumn, useNavigationBetweenEntries } from "@/features/daily/components/DailyList/hooks/useNavigateBetweenEntries";
import { getEntryElementId, getEntryPlaceholderElementId } from "@/features/daily/components/DailyList/utils/dailyEntriesSelectors";
import { DayHeader } from "@/features/daily/components/DayHeader/DayHeader";
import { DaySkeleton } from "@/features/daily/components/DaySkeleton";
import { useDailyMetrics } from "@/features/daily/hooks/useDailyMetrics.ts";
import { formatToISODateString } from "@/features/daily/utils/dateUtils";
import { DailyEntry, DailyEntryPlaceholder } from "@/features/entries/components/DailyEntry";
import { EntryFiltersGroup } from "@/features/entries/components/EntryFiltersGroup";
import { EntryQuickAddForm } from "@/features/entries/components/EntryQuickAddForm/EntryQuickAddForm.tsx";
import { useGetDailyEntriesByDateRange } from "@/features/entries/hooks";
import { Entry } from "@/features/entries/types/Entry";
import { ISODateString } from "@/types/ISODateString";
import { onNextTick } from "@/utils/onNextTick.ts";

export const DailyList = () => {
    const containerRef = useRef<HTMLElement | null>(null);
    const targetDailyDateRef = useRef<string | null>(null);
    const [filters, setFilters] = useState<{
        completed?: boolean;
        featured?: boolean;
    }>({});

    const { setPrev, setNext, setRange, reset, endDate, startDate, defaultDate } = useDailyDateRange({
        granularity: "month",
    });

    const { data: dailyMetrics } = useDailyMetrics({
        from: formatToISODateString(dayjs(startDate).startOf("year").toDate()),
        to: formatToISODateString(dayjs(startDate).endOf("year").toDate()),
    });

    const {
        data: entries,
        groupedData: entriesGroups,
        isFetching: isFetchingEntries,
        hasNextPage,
        fetchNextPage,
    } = useGetDailyEntriesByDateRange({
        from: formatToISODateString(startDate),
        to: formatToISODateString(endDate),
        featured: filters.featured,
        completed: filters.completed,
        autoFetch: true,
    });

    const dailies = useMemo(() => {
        const allEntries = entries?.pages?.flatMap((page) => page.data) ?? [];
        return Array.from(new Map(allEntries.map((entry) => [entry.date, { date: entry.date }])).values());
    }, [entries?.pages]);

    const {
        onCreateEntry,
        onUpdateEntryContent,
        onDeleteEntry,
        onUpdateEntryStatus,
        onUpdateEntryIsFeatured,
        onDeleteEntries,
        onUpdateEntries,
    } = useEntriesEvents();
    const { placeholders, addPlaceholder, removePlaceholder } = useDailyEntriesPlaceholders();

    const { navigateByIndex, navigateByEntryId, navigateToPlaceholderByGroup } = useNavigationBetweenEntries({
        entriesGroups,
        onBottomLeft: removePlaceholder,
        onBottomReached: addPlaceholder,
    });

    const onSavePlaceholder = async (date: ISODateString, content: string) => {
        const entry = await onCreateEntry({
            date,
            content,
            isCompleted: filters.completed ?? false,
            isFeatured: filters.featured ?? false,
        });

        if (entry) {
            navigateByEntryId("input", entry.id);
            removePlaceholder(date);
        }
    };

    const scrollToDaily = (date: string) => {
        if (!containerRef.current) {
            return false;
        }

        const dailyHeader = containerRef.current?.querySelector(`[data-daily-date="${date}"]`);

        if (dailyHeader) {
            targetDailyDateRef.current = null;
            dailyHeader.scrollIntoView({ behavior: "smooth", block: "center" });
            return true;
        }

        return false;
    };

    const navigateToDailyByDate = useCallback(
        (date: string) => {
            if (!containerRef.current) {
                return;
            }

            setRange(dayjs(date).startOf("month").toDate());

            onNextTick(() => {
                if (!scrollToDaily(date)) {
                    targetDailyDateRef.current = date;
                }
            });
        },
        [setRange]
    );

    const createEntryDraft = (date: string) => {
        addPlaceholder(date);
        navigateToPlaceholderByGroup(date);
    };

    const deleteEntries = async (entries: Entry[]) => {
        const ids = entries.map((entry) => entry.id);

        if (!ids.length) {
            return;
        }

        await onDeleteEntries(ids);
    };

    const updateEntriesDate = async (entries: Entry[], date: ISODateString) => {
        const ids = entries.map((entry) => entry.id);

        if (!ids.length) {
            return;
        }

        await onUpdateEntries(ids, { date });
    };

    const updateEntriesFeaturedStatus = async (entries: Entry[], value: boolean) => {
        const ids = entries.filter((entry) => entry.isFeatured !== value).map((entry) => entry.id);

        if (!ids.length) {
            return;
        }

        await onUpdateEntries(ids, { isFeatured: value });
    };

    const updateEntriesCompletionStatus = async (entries: Entry[], value: boolean) => {
        const ids = entries.filter((entry) => entry.isCompleted !== value).map((entry) => entry.id);

        if (!ids.length) {
            return;
        }

        await onUpdateEntries(ids, { isCompleted: value });
    };

    const onQuickCreateEntry = useCallback(
        async (entry: Pick<Entry, "content" | "date" | "isCompleted" | "isFeatured">) => {
            const result = await onCreateEntry(entry);

            if (result) {
                navigateToDailyByDate(result.date);
            }

            return result;
        },
        [navigateToDailyByDate, onCreateEntry]
    );

    useEffect(
        function processPendingDailyNavigation() {
            if (isFetchingEntries || !targetDailyDateRef.current) return;
            scrollToDaily(targetDailyDateRef.current);
        },
        [isFetchingEntries]
    );

    return (
        <main className={styles.container} ref={containerRef}>
            <DailyListHeader timeframeStart={startDate} onNextTimeframe={setNext} onPrevTimeframe={setPrev} onReset={reset}>
                <EntryFiltersGroup withReset onFiltersChange={setFilters} />
            </DailyListHeader>

            <DailyActivityChart
                activity={dailyMetrics?.activityHistory ?? []}
                onSelectDay={navigateToDailyByDate}
                isLoading={!dailyMetrics}
            />

            <div className={styles.floatingContainer}>
                <section className={styles.quickAddWrapper}>
                    <EntryQuickAddForm onCreateEntry={onQuickCreateEntry} defaultDate={defaultDate} />
                </section>
            </div>

            {dailies.map((daily) => (
                <section className={styles.day} key={daily.date} data-daily-date={daily.date}>
                    <DayHeader
                        date={daily.date}
                        onCreateEntryDraft={() => createEntryDraft(daily.date)}
                        onUpdateDate={(date) => updateEntriesDate(entriesGroups[daily.date] ?? [], date)}
                        onDeleteEntries={() => deleteEntries(entriesGroups[daily.date] ?? [])}
                        onEntriesStatusChange={(value) => updateEntriesCompletionStatus(entriesGroups[daily.date] ?? [], value)}
                        onEntriesIsFeaturedChange={(value) => updateEntriesFeaturedStatus(entriesGroups[daily.date] ?? [], value)}
                    />

                    <ul className={styles.entries}>
                        {entriesGroups[daily.date]?.map((entry, index) => (
                            <DailyEntry
                                id={getEntryElementId(entry.id)}
                                entry={entry}
                                key={entry.id}
                                onDelete={onDeleteEntry}
                                onChangeStatus={onUpdateEntryStatus}
                                onSaveContent={onUpdateEntryContent}
                                onChangeIsFeatured={onUpdateEntryIsFeatured}
                                onFocusColumn={(column: DailyEntryColumn) => navigateByIndex(column, daily.date, index)}
                                onNavigateDown={(target) => navigateByIndex(target, daily.date, index + 1)}
                                onNavigateUp={(target) => navigateByIndex(target, daily.date, index - 1)}
                            />
                        ))}

                        {(!entriesGroups[daily.date]?.length || placeholders.includes(daily.date)) && (
                            <DailyEntryPlaceholder
                                id={getEntryPlaceholderElementId(daily.date)}
                                onDelete={() => removePlaceholder(daily.date)}
                                onSaveContent={(content) => onSavePlaceholder(daily.date, content)}
                                onNavigateUp={() => navigateByIndex("input", daily.date, entriesGroups[daily.date]?.length - 1)}
                            />
                        )}
                    </ul>
                </section>
            ))}

            <ItemLoader
                shouldLoadNext={hasNextPage}
                onLoadNext={fetchNextPage}
                isLoaderVisible={isFetchingEntries && dayjs().isAfter(startDate)}
            >
                <DaySkeleton count={3} />
            </ItemLoader>

            {!dailies.length && !isFetchingEntries && <NoEntriesMessage timeframeStart={startDate} />}
        </main>
    );
};
