import { useMemo } from "react";
import { Column } from "react-data-grid";

import { EntryRow } from "../types/EntriesDataGrid";

import { useDataGridRenderers } from "@/components/DataGrid";
import { useEntriesDataGridRenderers } from "@/features/entries/components/EntriesDataGrid/hooks/useEntriesDataGridRenderers.ts";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

export const useEntriesDataGrid = () => {
    const t = useTranslate();
    const { headerCellRenderer } = useDataGridRenderers();
    const { isCompletedCellRenderer, isFeaturedCellRenderer, contentCellRenderer, dailyDateCellRenderer, dailyDateGroupCellRenderer } =
        useEntriesDataGridRenderers();

    const columns: readonly Column<EntryRow>[] = useMemo(
        () => [
            {
                key: "daily",
                name: t("reports.grid.columns.daily"),
                resizable: true,
                sortable: true,
                minWidth: 120,
                width: 120,
                renderCell: dailyDateCellRenderer,
                renderHeaderCell: headerCellRenderer,
                renderGroupCell: dailyDateGroupCellRenderer,
            },
            {
                key: "content",
                name: t("reports.grid.columns.content"),
                sortable: true,
                resizable: true,
                minWidth: 150,
                renderCell: contentCellRenderer,
                renderHeaderCell: headerCellRenderer,
            },
            {
                key: "isCompleted",
                name: t("reports.grid.columns.isCompleted"),
                sortable: true,
                resizable: true,
                minWidth: 140,
                width: 140,
                renderCell: isCompletedCellRenderer,
                renderHeaderCell: headerCellRenderer,
            },
            {
                key: "isFeatured",
                name: t("reports.grid.columns.isFeatured"),
                sortable: true,
                resizable: true,
                minWidth: 150,
                width: 150,
                renderCell: isFeaturedCellRenderer,
                renderHeaderCell: headerCellRenderer,
            },
        ],
        [
            t,
            dailyDateCellRenderer,
            headerCellRenderer,
            dailyDateGroupCellRenderer,
            contentCellRenderer,
            isCompletedCellRenderer,
            isFeaturedCellRenderer,
        ]
    );

    return { columns, rowKeyGetter };
};

const rowKeyGetter = (row: EntryRow) => row.id;
