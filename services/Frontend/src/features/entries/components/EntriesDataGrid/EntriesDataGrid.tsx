"use client";

import { useEntriesDataGrid } from "./hooks/useEntriesDataGrid";

import styles from "./styles/EntriesDataGrid.module.scss";

import { DataGrid } from "@/components/DataGrid";
import { DateRangeFiltersGroup } from "@/components/DateRangeFiltersGroup";
import { Field } from "@/components/Input";
import { NoRecordsFallback } from "@/features/entries/components/EntriesDataGrid/components/NoRecordsFallback/NoRecordsFallback.tsx";
import { useEntriesDataGridFilters } from "@/features/entries/components/EntriesDataGrid/hooks/useEntriesDataGridFilters.ts";
import { useEntryRows } from "@/features/entries/components/EntriesDataGrid/hooks/useEntryRows.ts";
import { EntryFiltersGroup } from "@/features/entries/components/EntryFiltersGroup";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

const GROUP_BY_COLUMNS = ["daily"];

// TODO: Replace Field with SearchField (based on https://react-spectrum.adobe.com/react-aria/SearchField.html)
// TODO: Enable grouping by goals
// TODO: Semantic html
export const EntriesDataGrid = () => {
    const t = useTranslate();

    const { columns, rowKeyGetter } = useEntriesDataGrid();
    const { setFlags, flags, dateRange, setDateRange, content, setContent, debouncedContent } = useEntriesDataGridFilters();
    const { data, isLoading } = useEntryRows({
        ...flags,
        ...dateRange,
        content: debouncedContent,
    });

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
                groupBy={GROUP_BY_COLUMNS}
                data={data}
                rowKeyGetter={rowKeyGetter}
                noRowsFallback={<NoRecordsFallback isLoading={isLoading} />}
                className={styles.grid}
            />
        </div>
    );
};
