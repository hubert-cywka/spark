"use client";

import { useState } from "react";
import { QueryKey } from "@tanstack/react-query";
import dayjs from "dayjs";

import styles from "./styles/DailyList.module.scss";

import { ItemLoader } from "@/components/ItemLoader/ItemLoader";
import { DailyListHeader } from "@/features/daily/components/DailyList/components/DailyListHeader/DailyListHeader";
import { useDailyDateRange } from "@/features/daily/components/DailyList/hooks/useDailyDateRange";
import { DaySkeleton } from "@/features/daily/components/Day";
import { Day } from "@/features/daily/components/Day/Day";
import { useCreateDaily } from "@/features/daily/hooks/useCreateDaily";
import { useCreateDailyEvents } from "@/features/daily/hooks/useCreateDailyEvents";
import { useGetDailiesByDateRange } from "@/features/daily/hooks/useGetDailiesByDateRange";
import { getFormattedDailyDate } from "@/features/daily/utils/dateUtils";
import { DailyEntry } from "@/features/entries/components/DailyEntry";
import { DailyEntryPlaceholder } from "@/features/entries/components/DailyEntry/DailyEntry";
import { useCreateEntry } from "@/features/entries/hooks/useCreateEntry";
import { useDeleteEntry } from "@/features/entries/hooks/useDeleteEntry";
import { useGetDailyEntriesByDateRange } from "@/features/entries/hooks/useGetDailyEntriesByDateRange";
import { useUpdateEntryContent } from "@/features/entries/hooks/useUpdateEntryContent";
import { Entry } from "@/features/entries/types/Entry";

const getEntryFocusableElement = (entryId: string) => {
    return document.getElementById(`entry-${entryId}`);
};

const getEntryPlaceholderFocusableElement = (dailyId: string) => {
    return document.getElementById(`entry-placeholder-${dailyId}`);
};

const useEntryPlaceholders = () => {
    const [placeholders, setPlaceholders] = useState<string[]>([]);

    const removePlaceholder = (dailyId: string) => {
        setPlaceholders((prev) => prev.filter((id) => id !== dailyId));
    };

    const addPlaceholder = (dailyId: string) => {
        setPlaceholders((prev) => [...prev, dailyId]);
    };

    return { placeholders, removePlaceholder, addPlaceholder };
};

type UseEntryNavigation = {
    dailyEntriesMap: Record<string, Entry[]>;
    onBottomReached: (dailyId: string) => void;
    onBottomLeft: (dailyId: string) => void;
};

const useEntryNavigation = ({ dailyEntriesMap, onBottomLeft, onBottomReached }: UseEntryNavigation) => {
    const navigateByEntryId = (entryId: string) => {
        getEntryFocusableElement(entryId)?.focus();
    };

    const navigateByIndex = (dailyId: string, targetIndex: number) => {
        const entries = dailyEntriesMap[dailyId];

        if (!entries || targetIndex < 0) {
            nextTick(() => getEntryPlaceholderFocusableElement(dailyId)?.focus());
            return;
        }

        if (targetIndex >= entries.length) {
            onBottomReached(dailyId);
            nextTick(() => getEntryPlaceholderFocusableElement(dailyId)?.focus());
            return;
        }

        onBottomLeft(dailyId);
        const targetEntry = entries[targetIndex];
        getEntryFocusableElement(targetEntry.id)?.focus();
    };

    return { navigateByEntryId, navigateByIndex };
};

type UseDailyListEvents = {
    queryKey: QueryKey;
    endDate: Date;
    startDate: Date;
};

const useDailyListEvents = ({ queryKey, endDate, startDate }: UseDailyListEvents) => {
    const { onCreateDailyError, onCreateDailySuccess } = useCreateDailyEvents();
    const { mutateAsync: createDaily } = useCreateDaily({ queryKey });

    const onCreateNewDaily = async () => {
        let newDailyDate = dayjs();

        if (!newDailyDate.isBefore(endDate) || !newDailyDate.isAfter(startDate)) {
            newDailyDate = dayjs(startDate);
        }

        try {
            await createDaily({
                date: getFormattedDailyDate(newDailyDate.toDate()),
            });
            onCreateDailySuccess();
        } catch (err) {
            onCreateDailyError(err);
        }
    };

    return { onCreateNewDaily };
};

type UseEntriesEvents = {
    queryKey: QueryKey;
    onEntryFocus: (entryId: string) => void;
};

const useEntriesEvents = ({ queryKey, onEntryFocus }: UseEntriesEvents) => {
    const { mutateAsync: createEntry } = useCreateEntry({ queryKey });
    const { mutateAsync: updateEntryContent } = useUpdateEntryContent({ queryKey });
    const { mutateAsync: deleteEntry } = useDeleteEntry({ queryKey });

    const onDeleteEntry = async (dailyId: string, entryId: string) => {
        await deleteEntry({ entryId, dailyId });
    };

    const onUpdateEntryContent = async (entry: Entry, newContent: string) => {
        await updateEntryContent({ entryId: entry.id, dailyId: entry.dailyId, content: newContent });
    };

    const onCreateEntry = async (dailyId: string, content: string) => {
        const result = await createEntry({ dailyId, content });
        nextTick(() => onEntryFocus(result.id));
    };

    return { onCreateEntry, onUpdateEntryContent, onDeleteEntry };
};

// TODO: Create dailies in more user-friendly way
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

    const dailies = dailyData?.pages?.flatMap((page) => page.data) ?? [];

    const { data: dailyEntriesMap, queryKey: entriesQueryKey } = useGetDailyEntriesByDateRange({
        from: getFormattedDailyDate(startDate),
        to: getFormattedDailyDate(endDate),
    });

    const { onCreateNewDaily } = useDailyListEvents({ queryKey, endDate, startDate });
    const { placeholders, addPlaceholder, removePlaceholder } = useEntryPlaceholders();

    const { navigateByIndex, navigateByEntryId } = useEntryNavigation({
        dailyEntriesMap,
        onBottomLeft: removePlaceholder,
        onBottomReached: addPlaceholder,
    });

    const { onCreateEntry, onUpdateEntryContent, onDeleteEntry } = useEntriesEvents({
        queryKey: entriesQueryKey,
        onEntryFocus: navigateByEntryId,
    });

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
                <Day key={daily.id} daily={daily}>
                    {dailyEntriesMap[daily.id]?.map((entry, index) => (
                        <DailyEntry
                            entry={entry}
                            key={entry.id}
                            onDelete={() => onDeleteEntry(entry.dailyId, entry.id)}
                            onSaveContent={(content) => onUpdateEntryContent(entry, content)}
                            onNavigateDown={() => navigateByIndex(daily.id, index + 1)}
                            onNavigateUp={() => navigateByIndex(daily.id, index - 1)}
                        />
                    ))}

                    {(!dailyEntriesMap[daily.id]?.length || placeholders.includes(daily.id)) && (
                        <DailyEntryPlaceholder
                            dailyId={daily.id}
                            onDelete={() => removePlaceholder(daily.id)}
                            onSaveContent={async (content) => {
                                // TODO: Doesn't feel right
                                await onCreateEntry(daily.id, content);
                                removePlaceholder(daily.id);
                            }}
                            onNavigateUp={() => navigateByIndex(daily.id, dailyEntriesMap[daily.id]?.length - 1)}
                            onNavigateDown={() => navigateByIndex(daily.id, Infinity)}
                        />
                    )}
                </Day>
            ))}

            <ItemLoader shouldLoadNext={hasNextPage} onLoadNext={fetchNextPage}>
                {isFetching && <DaySkeleton count={3} />}
            </ItemLoader>
        </main>
    );
};

const nextTick = (callback: () => unknown) => {
    setTimeout(callback, 0);
};
