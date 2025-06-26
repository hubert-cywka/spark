import { useMemo } from "react";
import { Column } from "react-data-grid";

import { EntryRow } from "../types/EntriesDataGrid";

import { useDataGridRenderers } from "@/components/DataGrid";
import { useEntriesDataGridRenderers } from "@/features/entries/components/EntriesDataGrid/hooks/useEntriesDataGridRenderers.ts";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type UseEntriesDataGridOptions = {
    allGroups: string[];
    activeGroups: string[];
    onColumnGrouped: (key: string) => void;
    onColumnUngrouped: (key: string) => void;
};

export const useEntriesDataGrid = ({ allGroups, activeGroups, onColumnGrouped, onColumnUngrouped }: UseEntriesDataGridOptions) => {
    const t = useTranslate();
    const { headerCellRenderer } = useDataGridRenderers<EntryRow>({
        allGroups,
        activeGroups,
        onColumnGrouped,
        onColumnUngrouped,
    });

    const {
        isCompletedCellRenderer,
        isFeaturedCellRenderer,
        contentCellRenderer,
        dailyDateCellRenderer,
        dailyDateGroupCellRenderer,
        isFeaturedGroupCellRenderer,
        isCompletedGroupCellRenderer,
        goalsCellRenderer,
        goalsGroupCellRenderer,
    } = useEntriesDataGridRenderers();

    const isDailyGrouped = activeGroups.includes("daily");
    const isGoalsGrouped = activeGroups.includes("goals");
    const isCompletedGrouped = activeGroups.includes("isCompleted");
    const isFeaturedGrouped = activeGroups.includes("isFeatured");

    const columns: readonly Column<EntryRow>[] = useMemo(
        () => [
            {
                key: "daily",
                name: t("reports.grid.columns.daily"),
                resizable: true,
                sortable: true,
                minWidth: 140,
                width: 140,
                renderCell: dailyDateCellRenderer,
                renderHeaderCell: headerCellRenderer,
                renderGroupCell: isDailyGrouped ? dailyDateGroupCellRenderer : undefined,
            },
            {
                key: "content",
                name: t("reports.grid.columns.content"),
                sortable: true,
                resizable: true,
                minWidth: 100,
                width: 300,
                renderCell: contentCellRenderer,
                renderHeaderCell: headerCellRenderer,
            },
            {
                key: "goals",
                name: t("reports.grid.columns.goals"),
                resizable: true,
                minWidth: 150,
                renderCell: goalsCellRenderer,
                renderHeaderCell: headerCellRenderer,
                renderGroupCell: isGoalsGrouped ? goalsGroupCellRenderer : undefined,
            },
            {
                key: "isCompleted",
                name: t("reports.grid.columns.isCompleted"),
                sortable: true,
                resizable: true,
                minWidth: 100,
                renderCell: isCompletedCellRenderer,
                renderHeaderCell: headerCellRenderer,
                renderGroupCell: isCompletedGrouped ? isCompletedGroupCellRenderer : undefined,
            },
            {
                key: "isFeatured",
                name: t("reports.grid.columns.isFeatured"),
                sortable: true,
                resizable: true,
                minWidth: 100,
                renderCell: isFeaturedCellRenderer,
                renderHeaderCell: headerCellRenderer,
                renderGroupCell: isFeaturedGrouped ? isFeaturedGroupCellRenderer : undefined,
            },
        ],
        [
            t,
            dailyDateCellRenderer,
            headerCellRenderer,
            isDailyGrouped,
            dailyDateGroupCellRenderer,
            contentCellRenderer,
            isCompletedCellRenderer,
            isCompletedGrouped,
            isCompletedGroupCellRenderer,
            isFeaturedCellRenderer,
            isFeaturedGrouped,
            isFeaturedGroupCellRenderer,
            goalsCellRenderer,
            isGoalsGrouped,
            goalsGroupCellRenderer,
        ]
    );

    return { columns, rowKeyGetter };
};

const rowKeyGetter = (row: EntryRow) => `${row.id}_${row.goals.concat("-")}`;
