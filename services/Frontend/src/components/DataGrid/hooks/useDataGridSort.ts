import { useMemo, useState } from "react";
import { SortColumn } from "react-data-grid";

import { getComparator } from "@/components/DataGrid/utils/getComparator.ts";

type UseDataGridSortOptions<TData> = {
    rows: TData[];
};

export function useDataGridSort<TData>({ rows }: UseDataGridSortOptions<TData>) {
    const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);

    const sortedRows = useMemo((): readonly TData[] => {
        if (sortColumns.length === 0) {
            return rows;
        }

        return [...rows].sort((a, b) => {
            for (const sort of sortColumns) {
                const comparator = getComparator(sort.columnKey as keyof TData);
                const compResult = comparator(a, b);

                if (compResult !== 0) {
                    return sort.direction === "ASC" ? compResult : -compResult;
                }
            }

            return 0;
        });
    }, [rows, sortColumns]);

    return { sortColumns, sortedRows, setSortColumns };
}
