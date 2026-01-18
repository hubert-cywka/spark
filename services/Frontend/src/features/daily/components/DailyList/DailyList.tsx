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
import { useNavigationBetweenEntries } from "@/features/daily/components/DailyList/hooks/useNavigateBetweenEntries";
import { getEntryElementId, getEntryPlaceholderElementId } from "@/features/daily/components/DailyList/utils/dailyEntriesSelectors";
import { DayHeader } from "@/features/daily/components/DayHeader/DayHeader";
import { DaySkeleton } from "@/features/daily/components/DaySkeleton";
import { useDailyMetrics } from "@/features/daily/hooks/useDailyMetrics.ts";
import { formatToISODateString } from "@/features/daily/utils/dateUtils";
import { DailyEntry, DailyEntryPlaceholder } from "@/features/entries/components/DailyEntry";
import { EntryFiltersGroup } from "@/features/entries/components/EntryFiltersGroup";
import { EntryQuickAddForm } from "@/features/entries/components/EntryQuickAddForm/EntryQuickAddForm.tsx";
import { useGetDailyEntriesByDateRange } from "@/features/entries/hooks";
import { useEntriesEvents } from "@/features/entries/hooks/useEntriesEvents";
import { Entry } from "@/features/entries/types/Entry";
import { ISODateString } from "@/types/ISODateString";
import { highlightElement } from "@/utils/highlight";
import { onNextTick } from "@/utils/onNextTick.ts";

export const DailyList = () => {
    const containerRef = useRef<HTMLElement | null>(null);
    const targetDailyDateRef = useRef<string | null>(null);
    const [filters, setFilters] = useState<{ completed?: boolean; featured?: boolean }>({});

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

    const {
        onCreateEntry,
        onUpdateEntryContent,
        onDeleteEntry,
        onUpdateEntryStatus,
        onUpdateEntryIsFeatured,
        onDeleteEntries,
        onUpdateEntries,
        onUpdateEntryDate,
    } = useEntriesEvents();

    const { placeholders, addPlaceholder, removePlaceholder } = useDailyEntriesPlaceholders();

    const { navigateByIndex, navigateByEntryId, navigateToPlaceholderByGroup } = useNavigationBetweenEntries({
        entriesGroups,
        onBottomLeft: removePlaceholder,
        onBottomReached: addPlaceholder,
    });

    const dailies = useMemo(() => {
        const allEntries = entries?.pages?.flatMap((page) => page.data) ?? [];
        const uniqueDates = Array.from(new Set(allEntries.map((e) => e.date)));
        return uniqueDates.sort((a, b) => b.localeCompare(a)).map((date) => ({ date }));
    }, [entries?.pages]);

    const scrollToDaily = useCallback((date: string) => {
        const dailyHeader = containerRef.current?.querySelector(`[data-daily-date="${date}"]`);

        if (!dailyHeader) {
            return false;
        }

        targetDailyDateRef.current = null;
        highlightElement(dailyHeader);
        return true;
    }, []);

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
        [setRange, scrollToDaily]
    );

    const handleBatchUpdate = useCallback(
        async (date: ISODateString, payload: Partial<Entry>) => {
            const group = entriesGroups[date] ?? [];

            const ids = group
                .filter((entry) => {
                    const keys = Object.keys(payload) as (keyof Entry)[];
                    return keys.some((key) => entry[key] !== payload[key]);
                })
                .map((e) => e.id);

            if (ids.length > 0) {
                await onUpdateEntries(ids, payload);
            }
        },
        [entriesGroups, onUpdateEntries]
    );

    const handleBatchDateUpdate = useCallback(
        async (oldDate: ISODateString, newDate: ISODateString) => {
            await handleBatchUpdate(oldDate, { date: newDate });
            scrollToDaily(newDate);
        },
        [handleBatchUpdate, scrollToDaily]
    );

    const handleBatchDelete = async (date: ISODateString) => {
        const group = entriesGroups[date] ?? [];
        const ids = group.map((entry) => entry.id);

        if (!ids.length) {
            return;
        }

        await onDeleteEntries(ids);
    };

    const handleCreateDraft = (date: string) => {
        addPlaceholder(date);
        navigateToPlaceholderByGroup(date);
    };

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

    useEffect(
        function processPendingDailyNavigation() {
            if (!isFetchingEntries && targetDailyDateRef.current) {
                scrollToDaily(targetDailyDateRef.current);
            }
        },
        [isFetchingEntries, scrollToDaily]
    );

    return (
        <main className={styles.container} ref={containerRef}>
            <DailyListHeader timeframeStart={startDate} onNextTimeframe={setNext} onPrevTimeframe={setPrev} onReset={reset}>
                <EntryFiltersGroup withReset onFiltersChange={setFilters} />
            </DailyListHeader>

            <DailyActivityChart
                className={styles.activityChart}
                activity={dailyMetrics?.activityHistory ?? []}
                onSelectDay={navigateToDailyByDate}
                isLoading={!dailyMetrics}
            />

            <div className={styles.floatingContainer}>
                <section className={styles.quickAddWrapper}>
                    <EntryQuickAddForm defaultDate={defaultDate} onCreateEntry={onCreateEntry} />
                </section>
            </div>

            {dailies.map((daily) => {
                const dayEntries = entriesGroups[daily.date] ?? [];
                const showPlaceholder = placeholders.includes(daily.date);

                return (
                    <section className={styles.day} key={daily.date} data-daily-date={daily.date}>
                        <DayHeader
                            date={daily.date}
                            onCreateEntryDraft={() => handleCreateDraft(daily.date)}
                            onDeleteEntries={() => handleBatchDelete(daily.date)}
                            onUpdateDate={(date) => handleBatchDateUpdate(daily.date, date)}
                            onStatusChange={(isCompleted) => handleBatchUpdate(daily.date, { isCompleted })}
                            onIsFeaturedChange={(isFeatured) => handleBatchUpdate(daily.date, { isFeatured })}
                        />

                        <ul className={styles.entries}>
                            {dayEntries.map((entry, index) => (
                                <DailyEntry
                                    key={entry.id}
                                    id={getEntryElementId(entry.id)}
                                    entry={entry}
                                    onDelete={onDeleteEntry}
                                    onChangeDate={onUpdateEntryDate}
                                    onChangeStatus={onUpdateEntryStatus}
                                    onSaveContent={onUpdateEntryContent}
                                    onChangeIsFeatured={onUpdateEntryIsFeatured}
                                    onFocusColumn={(column) => navigateByIndex(column, daily.date, index)}
                                    onNavigateDown={(target) => navigateByIndex(target, daily.date, index + 1)}
                                    onNavigateUp={(target) => navigateByIndex(target, daily.date, index - 1)}
                                />
                            ))}

                            {showPlaceholder && (
                                <DailyEntryPlaceholder
                                    id={getEntryPlaceholderElementId(daily.date)}
                                    onDelete={() => removePlaceholder(daily.date)}
                                    onSaveContent={(content) => onSavePlaceholder(daily.date, content)}
                                    onNavigateUp={() => navigateByIndex("input", daily.date, dayEntries.length - 1)}
                                />
                            )}
                        </ul>
                    </section>
                );
            })}

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
