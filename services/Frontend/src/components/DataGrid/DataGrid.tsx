import { ReactElement, useState } from "react";
import { Column, TreeDataGrid } from "react-data-grid";
import classNames from "clsx";

import styles from "./styles/DataGrid.module.scss";
import "react-data-grid/lib/styles.css";

import { useDataGridSort } from "@/components/DataGrid/hooks/useDataGridSort.ts";

const HEADER_ROW_HEIGHT = 40;

type DataGridProps<TData extends object> = {
    data: TData[];
    columns: readonly Column<TData>[];
    groupBy: readonly Column<TData>["key"][];
    rowKeyGetter: (row: TData) => string;
    noRowsFallback?: ReactElement;
    className?: string;
};

export function DataGrid<TData extends object>({ data, columns, rowKeyGetter, noRowsFallback, className, groupBy }: DataGridProps<TData>) {
    const [expandedGroupIds, setExpandedGroupIds] = useState((): ReadonlySet<unknown> => new Set<unknown>([]));
    const { sortedRows, setSortColumns, sortColumns } = useDataGridSort({
        rows: data,
    });

    return (
        <TreeDataGrid
            columns={columns}
            rows={sortedRows}
            rowKeyGetter={rowKeyGetter}
            sortColumns={sortColumns}
            onSortColumnsChange={setSortColumns}
            className={classNames(styles.dataGrid, className)}
            headerRowClass={styles.headerRow}
            rowClass={() => styles.row}
            renderers={{ noRowsFallback }}
            groupBy={groupBy}
            expandedGroupIds={expandedGroupIds}
            onExpandedGroupIdsChange={setExpandedGroupIds}
            rowGrouper={rowGrouper as RowGrouper<TData, string>}
            headerRowHeight={HEADER_ROW_HEIGHT}
        />
    );
}

type RowGrouper<TData extends object, TKey extends PropertyKey> = (
    rows: readonly TData[],
    columnKey: TKey
) => Record<string, readonly TData[]>;

function rowGrouper<TData extends object>(rows: readonly TData[], columnKey: keyof TData) {
    return Object.groupBy(rows, (r) => r[columnKey] as PropertyKey);
}
