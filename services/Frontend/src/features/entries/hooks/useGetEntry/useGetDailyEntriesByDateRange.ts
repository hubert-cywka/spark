import { useMemo } from "react";

import { useEntries } from "@/features/entries/hooks";
import { Entry } from "@/features/entries/types/Entry";
import { ISODateString } from "@/types/ISODateString";

type UseGetDailyEntriesByDateRangeOptions = {
    from: ISODateString;
    to: ISODateString;
    featured?: boolean;
    completed?: boolean;
    autoFetch?: boolean;
};

export const useGetDailyEntriesByDateRange = ({ from, to, featured, completed, autoFetch }: UseGetDailyEntriesByDateRangeOptions) => {
    const { data: entriesData, ...rest } = useEntries({
        filters: {
            from,
            to,
            featured,
            completed,
        },
        autoFetch,
    });

    const groupedData = useMemo(() => {
        const entries = entriesData?.pages?.flatMap((page) => page.data) ?? [];
        const entriesMap: Record<string, Entry[]> = {};

        entries.forEach((entry) => {
            const dailyEntries = entriesMap[entry.date];

            if (dailyEntries) {
                dailyEntries.push(entry);
            } else {
                entriesMap[entry.date] = [entry];
            }
        });

        return entriesMap;
    }, [entriesData]);

    return { data: entriesData, groupedData, ...rest };
};
