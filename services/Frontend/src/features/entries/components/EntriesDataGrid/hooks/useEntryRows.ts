import { useMemo } from "react";

import { useGetDailiesByDateRange } from "@/features/daily/hooks/useGetDailiesByDateRange.ts";
import { EntryRow } from "@/features/entries/components/EntriesDataGrid/types/EntriesDataGrid";
import { useEntries } from "@/features/entries/hooks";
import { Entry } from "@/features/entries/types/Entry";
import { ISODateString } from "@/types/ISODateString";

type UseEntryRowsOptions = {
    content?: string;
    completed?: boolean;
    featured?: boolean;
    from: ISODateString;
    to: ISODateString;
};

export const useEntryRows = ({ featured, from, to, content, completed }: UseEntryRowsOptions) => {
    const { data: dailiesData, isLoading: areDailiesLoading } = useGetDailiesByDateRange({
        filters: { from, to },
        autoFetch: true,
    });

    const { data: entriesData, isLoading: areEntriesLoading } = useEntries({
        filters: { completed, featured, from, to, content },
        autoFetch: true,
    });

    const dailies = useMemo(() => dailiesData?.pages.flatMap((page) => page.data) ?? [], [dailiesData?.pages]);
    const entries = useMemo(() => entriesData?.pages.flatMap((page) => page.data) ?? [], [entriesData?.pages]);

    const data = useMemo((): EntryRow[] => {
        const rows: EntryRow[] = [];

        if (areDailiesLoading || areEntriesLoading) {
            return rows;
        }

        entries.forEach((entry) => {
            const daily = dailies.find((daily) => daily.id === entry.dailyId);

            if (daily) {
                rows.push(mapToEntryRow(entry, daily.date));
            }
        });

        return rows;
    }, [areDailiesLoading, areEntriesLoading, dailies, entries]);

    return { data, isLoading: areEntriesLoading || areDailiesLoading };
};

const mapToEntryRow = (entry: Entry, daily: ISODateString): EntryRow => {
    return {
        daily,
        isFeatured: entry.isFeatured,
        createdAt: entry.createdAt,
        content: entry.content,
        isCompleted: entry.isCompleted,
        id: entry.id,
        goals: ["Mock goal", "Another example", "Simple mock"], // TODO: Provide real data
    };
};
