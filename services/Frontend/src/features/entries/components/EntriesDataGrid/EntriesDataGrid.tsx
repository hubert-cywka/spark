"use client";

import { useEntriesDataGrid } from "./hooks/useEntriesDataGrid";

import styles from "./styles/EntriesDataGrid.module.scss";

import { DataGrid } from "@/components/DataGrid";
import { DateRangePicker, Field } from "@/components/Input";
import { NoRecordsFallback } from "@/features/entries/components/EntriesDataGrid/components/NoRecordsFallback/NoRecordsFallback.tsx";
import { useEntriesDataGridFilters } from "@/features/entries/components/EntriesDataGrid/hooks/useEntriesDataGridFilters.ts";
import { useEntryRows } from "@/features/entries/components/EntriesDataGrid/hooks/useEntryRows.ts";
import { EntryFiltersGroup } from "@/features/entries/components/EntryFiltersGroup";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

const GROUP_BY_COLUMNS = ["daily"];

// TODO: Enable grouping by goals
// TODO: Semantic html
export const EntriesDataGrid = () => {
    const t = useTranslate();
    const { setFlags, flags, dateRange, setDateRange, content, setContent, debouncedContent } = useEntriesDataGridFilters();

    const { data, isLoading } = useEntryRows({
        ...flags,
        ...dateRange,
        content: debouncedContent,
    });
    const { columns, rowKeyGetter } = useEntriesDataGrid();

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
                data={data}
                rowKeyGetter={rowKeyGetter}
                noRowsFallback={<NoRecordsFallback isLoading={isLoading} />}
                className={styles.grid}
            />
        </div>
    );
};
