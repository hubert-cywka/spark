import { useMemo } from "react";

import { useEntries } from "@/features/entries/hooks";
import { Entry } from "@/features/entries/types/Entry";
import { useAutoFetch } from "@/hooks/useAutoFetch";

type UseGetDailyEntriesByDateRangeOptions = {
    from: string;
    to: string;
    featured?: boolean;
    completed?: boolean;
    autoFetch?: boolean;
};

export const useGetDailyEntriesByDateRange = ({ from, to, featured, completed, autoFetch }: UseGetDailyEntriesByDateRangeOptions) => {
    const { data: entriesData, hasNextPage, fetchNextPage, ...rest } = useEntries({ from, to, featured, completed });
    useAutoFetch({
        shouldFetch: !!autoFetch && hasNextPage,
        fetch: fetchNextPage,
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

    return { data, hasNextPage, fetchNextPage, ...rest };
};
