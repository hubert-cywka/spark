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
import { useEntryDetails } from "@/features/entries/components/EntriesDataGrid/hooks/useEntryDetails.ts";
import { EntriesDataGridColumn } from "@/features/entries/components/EntriesDataGrid/types/EntriesDataGrid";
import { EntryFiltersGroup } from "@/features/entries/components/EntryFiltersGroup";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";
import { denormalize } from "@/utils/tableUtils.ts";

// TODO: Mention, that aggregating by "goals" may seemingly duplicate entries
const GROUP_BY_COLUMNS: EntriesDataGridColumn[] = ["goals", "daily", "isFeatured", "isCompleted"];

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
    const { data, isLoading } = useEntryDetails({
        filters: { ...flags, ...dateRange, content: debouncedContent },
        autoFetch: true,
    });

    const denormalizedData = useMemo(() => {
        if (!activeGroups.includes("goals")) {
            return data;
        }

        return denormalize(data, "goals");
    }, [activeGroups, data]);

    return (
        <div className={styles.container}>
            <div className={styles.filters}>
                <DateRangeFiltersGroup size="1" dateRange={dateRange} onDateRangeChange={setDateRange} />

                <div className={styles.filtersGroup}>
                    <Field size="1" label={t("reports.filters.content.label")} value={content} onChange={setContent} />
                    <EntryFiltersGroup size="1" className={styles.booleanFilters} onFiltersChange={setFlags} />
                </div>
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
