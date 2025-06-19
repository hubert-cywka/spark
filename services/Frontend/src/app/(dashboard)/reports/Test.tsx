"use client";

import { useMemo, useState } from "react";
import { Column, DataGrid, RenderCellProps, SortColumn } from "react-data-grid";
import { CheckIcon, XIcon } from "lucide-react";

import styles from "./Test.module.scss";
import "react-data-grid/lib/styles.css";

import { Icon } from "@/components/Icon";
import { DateRangePicker, Field } from "@/components/Input";
import { EntryFiltersGroup } from "@/features/entries/components/EntryFiltersGroup";
import { ISODateString } from "@/types/ISODateString";

export const Test = () => {
    return (
        <div>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                <EntryFiltersGroup size="2" onFiltersChange={() => ({})} />
                <Field size="3" label="Entry content" />
                <DateRangePicker size="3" label="Date range" value={null} />
            </div>
            <AdvancedDataGrid />
        </div>
    );
};

type Entry = {
    id: string;
    daily: ISODateString;
    content: string;
    isCompleted: boolean;
    isFeatured: boolean;
    createdAt: Date;
};

const initialRows: Entry[] = [
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
];

const DateCellRenderer = (p: RenderCellProps<Entry>) => {
    return <>{p.row.createdAt.toLocaleString()}</>;
};

const BooleanCellRenderer = (p: RenderCellProps<Entry>) => {
    const value = p.row[p.column.key as ColumnType];

    return <>{value ? <Icon slot={CheckIcon} /> : <Icon slot={XIcon} />}</>;
};

const columns: readonly Column<Entry>[] = [
    {
        key: "id",
        name: "ID",
        width: 80,
    },
    {
        key: "daily",
        name: "Date",
        width: 120,
        sortable: true,
    },
    {
        key: "content",
        name: "Content",
        sortable: true,
    },
    {
        key: "isCompleted",
        name: "Completed",
        width: 100,
        sortable: true,
        renderCell: BooleanCellRenderer,
    },
    {
        key: "isFeatured",
        name: "Featured",
        width: 100,
        sortable: true,
        renderCell: BooleanCellRenderer,
    },
    {
        key: "createdAt",
        name: "Created at",
        width: 180,
        sortable: true,
        renderCell: DateCellRenderer,
    },
];

type ColumnType = keyof Entry;

function getComparator(sortColumn: ColumnType): (a: Entry, b: Entry) => number {
    switch (sortColumn) {
        case "id":
        case "daily":
        case "content":
            return (a, b) => a[sortColumn].localeCompare(b[sortColumn]);
        case "isCompleted":
        case "isFeatured":
            return (a, b) => (a[sortColumn] === b[sortColumn] ? 0 : a[sortColumn] ? -1 : 1);
        case "createdAt":
            return (a, b) => a[sortColumn].getTime() - b[sortColumn].getTime();
        default:
            throw new Error(`Unsupported sortColumn: "${sortColumn}"`);
    }
}

const AdvancedDataGrid = () => {
    const [rows, setRows] = useState(initialRows);
    const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);

    const sortedRows = useMemo((): readonly Entry[] => {
        if (sortColumns.length === 0) return rows;

        return [...rows].sort((a, b) => {
            for (const sort of sortColumns) {
                const comparator = getComparator(sort.columnKey as ColumnType);
                const compResult = comparator(a, b);

                if (compResult !== 0) {
                    return sort.direction === "ASC" ? compResult : -compResult;
                }
            }
            return 0;
        });
    }, [rows, sortColumns]);

    const onRowsChange = (newRows: Entry[]) => {
        setRows(newRows);
    };

    return (
        <DataGrid
            columns={columns}
            rows={sortedRows}
            onRowsChange={onRowsChange}
            rowKeyGetter={(row) => row.id}
            sortColumns={sortColumns}
            onSortColumnsChange={setSortColumns}
            className={styles.dataGrid}
            headerRowClass={styles.headerRow}
            rowClass={() => styles.row}
        />
    );
};
