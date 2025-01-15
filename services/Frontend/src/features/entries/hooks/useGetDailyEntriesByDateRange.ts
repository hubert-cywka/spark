import { useEffect, useMemo } from "react";

import { useGetEntriesByDateRange } from "@/features/entries/hooks/useGetEntriesByDateRange";
import { Entry } from "@/features/entries/types/Entry";

type UseGetDailyEntriesByDateRangeOptions = {
    from: string;
    to: string;
};

export const useGetDailyEntriesByDateRange = ({ from, to }: UseGetDailyEntriesByDateRangeOptions) => {
    const { data: entriesData, hasNextPage, fetchNextPage, ...rest } = useGetEntriesByDateRange({ from, to });

    useEffect(() => {
        if (hasNextPage) {
            void fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage]);

    const data = useMemo(() => {
        const entries = entriesData?.pages?.flatMap((page) => page.data) ?? [];
        const entriesMap: Record<string, Entry[]> = {};

        entries.forEach((entry) => {
            const dailyEntries = entriesMap[entry.dailyId];

            if (dailyEntries) {
                dailyEntries.push(entry);
            } else {
                entriesMap[entry.dailyId] = [entry];
            }
        });

        return entriesMap;
    }, [entriesData]);

    return { data, hasNextPage, fetchNextPage, ...rest };
};
