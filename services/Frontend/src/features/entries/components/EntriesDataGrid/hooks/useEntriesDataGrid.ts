import { useMemo } from "react";
import { Column } from "react-data-grid";

import { EntryRow } from "../types/EntriesDataGrid";

import { useDataGridRenderers } from "@/components/DataGrid";
import { useEntriesDataGridRenderers } from "@/features/entries/components/EntriesDataGrid/hooks/useEntriesDataGridRenderers.ts";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

export const useEntriesDataGrid = () => {
    const t = useTranslate();
    const { headerCellRenderer } = useDataGridRenderers();
    const { isCompletedCellRenderer, isFeaturedCellRenderer, contentCellRenderer, dailyDateCellRenderer } = useEntriesDataGridRenderers();

    const columns: readonly Column<EntryRow>[] = useMemo(
        () => [
            {
                key: "daily",
                name: t("reports.grid.columns.daily"),
                resizable: true,
                sortable: true,
                minWidth: 100,
                width: 100,
                renderCell: dailyDateCellRenderer,
                renderHeaderCell: headerCellRenderer,
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
        [dailyDateCellRenderer, headerCellRenderer, contentCellRenderer, isCompletedCellRenderer, isFeaturedCellRenderer, t]
    );

    return { columns, rowKeyGetter };
};

const rowKeyGetter = (row: Entry) => row.id;
