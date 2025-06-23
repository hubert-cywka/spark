import { useMemo } from "react";

import { useEntries } from "@/features/entries/hooks";
import { Entry } from "@/features/entries/types/Entry";

type UseGetDailyEntriesByDateRangeOptions = {
    from: string;
    to: string;
    content?: string;
    featured?: boolean;
    completed?: boolean;
    autoFetch?: boolean;
};

export const useGetDailyEntriesByDateRange = ({
    from,
    to,
    featured,
    completed,
    content,
    autoFetch,
}: UseGetDailyEntriesByDateRangeOptions) => {
    const { data: entriesData, ...rest } = useEntries({
        filters: {
            from,
            to,
            featured,
            completed,
            content,
        },
        autoFetch,
    });

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

    return { data, ...rest };
};
