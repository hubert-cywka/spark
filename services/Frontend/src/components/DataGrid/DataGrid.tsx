"use client";

import { ReactElement } from "react";
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
    const { sortedRows, setSortColumns, sortColumns } = useDataGridSort({
        rows: data,
    });

    return (
        <BaseDataGrid
            columns={columns}
            rows={sortedRows}
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
