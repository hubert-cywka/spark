"use client";

import { ReactElement, useState } from "react";
import { Column, DataGrid as BaseDataGrid } from "react-data-grid";
import classNames from "clsx";

import styles from "./styles/DataGrid.module.scss";
import "react-data-grid/lib/styles.css";

import { useDataGridSort } from "@/components/DataGrid/hooks/useDataGridSort.ts";

type DataGridProps<TData> = {
    data: TData[];
    columns: readonly Column<TData>[];
    rowKeyGetter: (row: TData) => string;
    noRowsFallback?: ReactElement;
    className?: string;
};

export function DataGrid<TData>({ data, columns, rowKeyGetter, noRowsFallback, className }: DataGridProps<TData>) {
    const [rows, setRows] = useState<TData[]>(data);
    const { sortedRows, setSortColumns, sortColumns } = useDataGridSort({
        rows,
    });

    const onRowsChange = (newRows: TData[]) => {
        setRows(newRows);
    };

    return (
        <BaseDataGrid
            columns={columns}
            rows={sortedRows}
            onRowsChange={onRowsChange}
            rowKeyGetter={rowKeyGetter}
            sortColumns={sortColumns}
            onSortColumnsChange={setSortColumns}
            className={classNames(styles.dataGrid, className)}
            headerRowClass={styles.headerRow}
            rowClass={() => styles.row}
            renderers={{
                noRowsFallback,
            }}
        />
    );
}
