import { useMemo } from "react";

import { ContentCellRenderer } from "../renderers/ContentCellRenderer.tsx";
import { IsCompletedCellRenderer } from "../renderers/IsCompletedCellRenderer.tsx";
import { IsFeaturedCellRenderer } from "../renderers/IsFeaturedCellRenderer.tsx";

import { DailyDateCellRenderer } from "@/features/entries/components/EntriesDataGrid/renderers/DailyDateCellRenderer.tsx";

export const useEntriesDataGridRenderers = () => {
    return useMemo(
        () => ({
            isCompletedCellRenderer: IsCompletedCellRenderer,
            isFeaturedCellRenderer: IsFeaturedCellRenderer,
            contentCellRenderer: ContentCellRenderer,
            dailyDateCellRenderer: DailyDateCellRenderer,
        }),
        []
    );
};
