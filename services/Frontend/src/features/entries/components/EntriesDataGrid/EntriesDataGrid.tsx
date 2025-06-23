"use client";

import { useState } from "react";

import { useEntriesDataGrid } from "./hooks/useEntriesDataGrid";

import styles from "./styles/EntriesDataGrid.module.scss";

import { DataGrid } from "@/components/DataGrid";
import { DateRangePicker, Field } from "@/components/Input";
import { NoRecordsMessage } from "@/features/entries/components/EntriesDataGrid/components/NoRecordsMessage/NoRecordsMessage.tsx";
import { EntryFiltersGroup } from "@/features/entries/components/EntryFiltersGroup";
import { useEntries } from "@/features/entries/hooks";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";
import { DateRangePreset } from "@/types/DateRangePreset.ts";
import { ISODateString } from "@/types/ISODateString";
import { getDateRange } from "@/utils/getDateRange.ts";

const GROUP_BY_COLUMNS = ["daily"];

// TODO: Clean up
// TODO: Debounce
const useEntriesDataGridFilters = () => {
    const [content, setContent] = useState("");

    const [dateRange, setDateRange] = useState<{
        from: ISODateString;
        to: ISODateString;
    }>(getDateRange(DateRangePreset.PAST_MONTH));

    const [flags, setFlags] = useState<{
        completed?: boolean;
        featured?: boolean;
    }>({});

    return {
        content,
        setContent,
        dateRange,
        setDateRange,
        flags,
        setFlags,
    };
};

// TODO: Fetch entries and server-side filtering
export const EntriesDataGrid = () => {
    const t = useTranslate();
    const { columns, rowKeyGetter } = useEntriesDataGrid();
    const { setFlags, flags, dateRange, setDateRange, content, setContent } = useEntriesDataGridFilters();

    const { data } = useEntries({
        completed: flags.completed,
        featured: flags.featured,
        from: dateRange.from,
        to: dateRange.to,
        content,
    });

    const entries = data?.pages.flatMap((page) => page.data) ?? [];
    const mappedEntries = entries.map((entry) => ({
        ...entry,
        daily: "2025-06-06" as ISODateString,
    }));

    return (
        <div className={styles.container}>
            <div className={styles.filters}>
                <EntryFiltersGroup onFiltersChange={setFlags} />
                <Field size="3" label={t("reports.filters.content.label")} value={content} onChange={setContent} />
                <DateRangePicker size="3" label={t("reports.filters.daily.label")} value={dateRange} onChange={setDateRange} />
            </div>
            <DataGrid
                columns={columns}
                groupBy={GROUP_BY_COLUMNS}
                data={mappedEntries}
                rowKeyGetter={rowKeyGetter}
                noRowsFallback={<NoRecordsMessage />}
                className={styles.grid}
            />
        </div>
    );
};
