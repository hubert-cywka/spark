"use client";

import { useMemo, useState } from "react";
import dayjs from "dayjs";

import { useEntriesDataGrid } from "./hooks/useEntriesDataGrid";

import styles from "./styles/EntriesDataGrid.module.scss";

import { DataGrid } from "@/components/DataGrid";
import { DateRangePicker, Field } from "@/components/Input";
import { NoRecordsMessage } from "@/features/entries/components/EntriesDataGrid/components/NoRecordsMessage/NoRecordsMessage.tsx";
import { EntryRow } from "@/features/entries/components/EntriesDataGrid/types/EntriesDataGrid";
import { EntryFiltersGroup } from "@/features/entries/components/EntryFiltersGroup";
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

    const mockFilteredEntries = useMemo(() => {
        const byContent = (row: EntryRow) => {
            if (!content) {
                return true;
            }

            return row.content.toLowerCase().includes(content.toLowerCase());
        };

        const byFeatured = (row: EntryRow) => {
            if (flags.featured === undefined) {
                return true;
            }

            return row.isFeatured === flags.featured;
        };

        const byCompleted = (row: EntryRow) => {
            if (flags.completed === undefined) {
                return true;
            }

            return row.isCompleted === flags.completed;
        };

        const byDate = (row: EntryRow) => {
            return dayjs(row.daily).isAfter(dateRange.from) && dayjs(row.daily).isBefore(dateRange.to);
        };

        return initialRows.filter(byContent).filter(byCompleted).filter(byFeatured).filter(byDate);
    }, [content, dateRange.from, dateRange.to, flags.completed, flags.featured]);

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
                data={mockFilteredEntries}
                rowKeyGetter={rowKeyGetter}
                noRowsFallback={<NoRecordsMessage />}
                className={styles.grid}
            />
        </div>
    );
};

const initialRows: EntryRow[] = [
    {
        id: "1",
        daily: "2025-06-19",
        content: "Stworzyć komponent data-grid",
        isCompleted: true,
        isFeatured: true,
        createdAt: new Date("2025-06-19T10:00:00Z"),
    },
    {
        id: "2",
        daily: "2025-06-19",
        content: "Dodać sortowanie do kolumn",
        isCompleted: true,
        isFeatured: false,
        createdAt: new Date("2025-06-19T11:00:00Z"),
    },
    {
        id: "3",
        daily: "2025-06-20",
        content: "Zaimplementować grupowanie",
        isCompleted: false,
        isFeatured: true,
        createdAt: new Date("2025-06-20T09:30:00Z"),
    },
    {
        id: "4",
        daily: "2025-06-21",
        content: "Umożliwić zmianę kolejności kolumn",
        isCompleted: false,
        isFeatured: false,
        createdAt: new Date("2025-06-21T14:00:00Z"),
    },
    {
        id: "5",
        daily: "2025-06-20",
        content: "Przetestować działanie komponentu",
        isCompleted: false,
        isFeatured: false,
        createdAt: new Date("2025-06-20T15:00:00Z"),
    },
    {
        id: "11",
        daily: "2025-06-19",
        content: "Stworzyć komponent data-grid",
        isCompleted: true,
        isFeatured: true,
        createdAt: new Date("2025-06-19T10:00:00Z"),
    },
    {
        id: "12",
        daily: "2025-06-19",
        content: "Dodać sortowanie do kolumn",
        isCompleted: true,
        isFeatured: false,
        createdAt: new Date("2025-06-19T11:00:00Z"),
    },
    {
        id: "13",
        daily: "2025-06-20",
        content: "Zaimplementować grupowanie",
        isCompleted: false,
        isFeatured: true,
        createdAt: new Date("2025-06-20T09:30:00Z"),
    },
    {
        id: "14",
        daily: "2025-06-21",
        content: "Umożliwić zmianę kolejności kolumn",
        isCompleted: false,
        isFeatured: false,
        createdAt: new Date("2025-06-21T14:00:00Z"),
    },
    {
        id: "15",
        daily: "2025-06-20",
        content: "Przetestować działanie komponentu",
        isCompleted: false,
        isFeatured: false,
        createdAt: new Date("2025-06-20T15:00:00Z"),
    },
    {
        id: "21",
        daily: "2025-06-19",
        content: "Stworzyć komponent data-grid",
        isCompleted: true,
        isFeatured: true,
        createdAt: new Date("2025-06-19T10:00:00Z"),
    },
    {
        id: "22",
        daily: "2025-06-19",
        content: "Dodać sortowanie do kolumn",
        isCompleted: true,
        isFeatured: false,
        createdAt: new Date("2025-06-19T11:00:00Z"),
    },
    {
        id: "23",
        daily: "2025-06-20",
        content: "Zaimplementować grupowanie",
        isCompleted: false,
        isFeatured: true,
        createdAt: new Date("2025-06-20T09:30:00Z"),
    },
    {
        id: "24",
        daily: "2025-06-21",
        content: "Umożliwić zmianę kolejności kolumn",
        isCompleted: false,
        isFeatured: false,
        createdAt: new Date("2025-06-21T14:00:00Z"),
    },
    {
        id: "25",
        daily: "2025-06-20",
        content: "Przetestować działanie komponentu",
        isCompleted: false,
        isFeatured: false,
        createdAt: new Date("2025-06-20T15:00:00Z"),
    },
    {
        id: "111",
        daily: "2025-06-19",
        content: "Stworzyć komponent data-grid",
        isCompleted: true,
        isFeatured: true,
        createdAt: new Date("2025-06-19T10:00:00Z"),
    },
    {
        id: "112",
        daily: "2025-06-19",
        content: "Dodać sortowanie do kolumn",
        isCompleted: true,
        isFeatured: false,
        createdAt: new Date("2025-06-19T11:00:00Z"),
    },
    {
        id: "113",
        daily: "2025-06-20",
        content: "Zaimplementować grupowanie",
        isCompleted: false,
        isFeatured: true,
        createdAt: new Date("2025-06-20T09:30:00Z"),
    },
    {
        id: "114",
        daily: "2025-06-21",
        content: "Umożliwić zmianę kolejności kolumn",
        isCompleted: false,
        isFeatured: false,
        createdAt: new Date("2025-06-21T14:00:00Z"),
    },
    {
        id: "115",
        daily: "2025-06-20",
        content: "Przetestować działanie komponentu",
        isCompleted: false,
        isFeatured: false,
        createdAt: new Date("2025-06-20T15:00:00Z"),
    },
    {
        id: "31",
        daily: "2025-06-19",
        content: "Stworzyć komponent data-grid",
        isCompleted: true,
        isFeatured: true,
        createdAt: new Date("2025-06-19T10:00:00Z"),
    },
    {
        id: "32",
        daily: "2025-06-19",
        content: "Dodać sortowanie do kolumn",
        isCompleted: true,
        isFeatured: false,
        createdAt: new Date("2025-06-19T11:00:00Z"),
    },
    {
        id: "33",
        daily: "2025-06-20",
        content: "Zaimplementować grupowanie",
        isCompleted: false,
        isFeatured: true,
        createdAt: new Date("2025-06-20T09:30:00Z"),
    },
    {
        id: "34",
        daily: "2025-06-21",
        content: "Umożliwić zmianę kolejności kolumn",
        isCompleted: false,
        isFeatured: false,
        createdAt: new Date("2025-06-21T14:00:00Z"),
    },
    {
        id: "35",
        daily: "2025-06-20",
        content: "Przetestować działanie komponentu",
        isCompleted: false,
        isFeatured: false,
        createdAt: new Date("2025-06-20T15:00:00Z"),
    },
    {
        id: "131",
        daily: "2025-06-19",
        content: "Stworzyć komponent data-grid",
        isCompleted: true,
        isFeatured: true,
        createdAt: new Date("2025-06-19T10:00:00Z"),
    },
    {
        id: "132",
        daily: "2025-06-19",
        content: "Dodać sortowanie do kolumn",
        isCompleted: true,
        isFeatured: false,
        createdAt: new Date("2025-06-19T11:00:00Z"),
    },
    {
        id: "133",
        daily: "2025-06-20",
        content: "Zaimplementować grupowanie",
        isCompleted: false,
        isFeatured: true,
        createdAt: new Date("2025-06-20T09:30:00Z"),
    },
    {
        id: "134",
        daily: "2025-06-21",
        content: "Umożliwić zmianę kolejności kolumn",
        isCompleted: false,
        isFeatured: false,
        createdAt: new Date("2025-06-21T14:00:00Z"),
    },
    {
        id: "135",
        daily: "2025-06-20",
        content: "Przetestować działanie komponentu",
        isCompleted: false,
        isFeatured: false,
        createdAt: new Date("2025-06-20T15:00:00Z"),
    },
    {
        id: "231",
        daily: "2025-06-19",
        content: "Stworzyć komponent data-grid",
        isCompleted: true,
        isFeatured: true,
        createdAt: new Date("2025-06-19T10:00:00Z"),
    },
    {
        id: "232",
        daily: "2025-06-19",
        content: "Dodać sortowanie do kolumn",
        isCompleted: true,
        isFeatured: false,
        createdAt: new Date("2025-06-19T11:00:00Z"),
    },
    {
        id: "233",
        daily: "2025-06-20",
        content: "Zaimplementować grupowanie",
        isCompleted: false,
        isFeatured: true,
        createdAt: new Date("2025-06-20T09:30:00Z"),
    },
    {
        id: "324",
        daily: "2025-06-21",
        content: "Umożliwić zmianę kolejności kolumn",
        isCompleted: false,
        isFeatured: false,
        createdAt: new Date("2025-06-21T14:00:00Z"),
    },
    {
        id: "325",
        daily: "2025-06-20",
        content: "Przetestować działanie komponentu",
        isCompleted: false,
        isFeatured: false,
        createdAt: new Date("2025-06-20T15:00:00Z"),
    },
    {
        id: "1311",
        daily: "2025-06-19",
        content: "Stworzyć komponent data-grid",
        isCompleted: true,
        isFeatured: true,
        createdAt: new Date("2025-06-19T10:00:00Z"),
    },
    {
        id: "1312",
        daily: "2025-06-19",
        content: "Dodać sortowanie do kolumn",
        isCompleted: true,
        isFeatured: false,
        createdAt: new Date("2025-06-19T11:00:00Z"),
    },
    {
        id: "1313",
        daily: "2025-06-20",
        content: "Zaimplementować grupowanie",
        isCompleted: false,
        isFeatured: true,
        createdAt: new Date("2025-06-20T09:30:00Z"),
    },
    {
        id: "1314",
        daily: "2025-06-21",
        content: "Umożliwić zmianę kolejności kolumn",
        isCompleted: false,
        isFeatured: false,
        createdAt: new Date("2025-06-21T14:00:00Z"),
    },
    {
        id: "3115",
        daily: "2025-06-20",
        content: "Przetestować działanie komponentu",
        isCompleted: false,
        isFeatured: false,
        createdAt: new Date("2025-06-20T15:00:00Z"),
    },
];
