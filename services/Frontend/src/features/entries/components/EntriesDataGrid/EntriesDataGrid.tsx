"use client";

import { useMemo } from "react";

import { useEntriesDataGrid } from "./hooks/useEntriesDataGrid";

import styles from "./styles/EntriesDataGrid.module.scss";

import { DataGrid } from "@/components/DataGrid";
import { DateRangeFiltersGroup } from "@/components/DateRangeFiltersGroup";
import { Field } from "@/components/Input";
import { NoRecordsFallback } from "@/features/entries/components/EntriesDataGrid/components/NoRecordsFallback/NoRecordsFallback.tsx";
import { useEntriesDataGridFilters } from "@/features/entries/components/EntriesDataGrid/hooks/useEntriesDataGridFilters.ts";
import { useEntriesDataGridGroups } from "@/features/entries/components/EntriesDataGrid/hooks/useEntriesDataGridGroups.ts";
import { useEntryRows } from "@/features/entries/components/EntriesDataGrid/hooks/useEntryRows.ts";
import { EntriesDataGridColumn } from "@/features/entries/components/EntriesDataGrid/types/EntriesDataGrid";
import { EntryFiltersGroup } from "@/features/entries/components/EntryFiltersGroup";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";
import { denormalize } from "@/utils/tableUtils.ts";

// TODO: Mention, that aggregating by "goals" may seemingly duplicate entries
const GROUP_BY_COLUMNS: EntriesDataGridColumn[] = ["goals", "daily", "isFeatured", "isCompleted"];

// TODO: Replace Field with SearchField (based on https://react-spectrum.adobe.com/react-aria/SearchField.html)
// TODO: Semantic html
// TODO: Filter by groups
export const EntriesDataGrid = () => {
    const t = useTranslate();

    const { activeGroups, onColumnGrouped, onColumnUngrouped } = useEntriesDataGridGroups();
    const { columns, rowKeyGetter } = useEntriesDataGrid({
        allGroups: GROUP_BY_COLUMNS,
        activeGroups,
        onColumnGrouped,
        onColumnUngrouped,
    });

    const { setFlags, flags, dateRange, setDateRange, content, setContent, debouncedContent } = useEntriesDataGridFilters();
    const { data: entryRows, isLoading } = useEntryRows({
        ...flags,
        ...dateRange,
        content: debouncedContent,
    });

    // Hubert: Only the "goals" column needs to be denormalized, no need to make this generic for now.
    const denormalizedData = useMemo(() => {
        if (!activeGroups.includes("goals")) {
            return entryRows;
        }

        return denormalize(entryRows, "goals");
    }, [activeGroups, entryRows]);

    return (
        <div className={styles.container}>
            <div className={styles.filters}>
                <div className={styles.filtersGroup}>
                    <Field size="3" label={t("reports.filters.content.label")} value={content} onChange={setContent} />
                    <EntryFiltersGroup onFiltersChange={setFlags} />
                </div>
                <DateRangeFiltersGroup dateRange={dateRange} onDateRangeChange={setDateRange} />
            </div>

            <DataGrid
                columns={columns}
                groupBy={activeGroups}
                data={denormalizedData}
                rowKeyGetter={rowKeyGetter}
                noRowsFallback={<NoRecordsFallback isLoading={isLoading} />}
                className={styles.grid}
            />
        </div>
    );
};
