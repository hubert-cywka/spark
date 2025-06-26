import { useMemo } from "react";

import { ContentCellRenderer } from "../renderers/ContentCellRenderer.tsx";
import { IsCompletedCellRenderer, IsCompletedGroupCellRenderer } from "../renderers/IsCompletedCellRenderer.tsx";
import { IsFeaturedCellRenderer, IsFeaturedGroupCellRenderer } from "../renderers/IsFeaturedCellRenderer.tsx";

import {
    DailyDateCellRenderer,
    DailyDateGroupCellRenderer,
} from "@/features/entries/components/EntriesDataGrid/renderers/DailyDateCellRenderer.tsx";
import { GoalsCellRenderer, GoalsGroupCellRenderer } from "@/features/entries/components/EntriesDataGrid/renderers/GoalsCellRenderer.tsx";

export const useEntriesDataGridRenderers = () => {
    return useMemo(
        () => ({
            isCompletedCellRenderer: IsCompletedCellRenderer,
            isCompletedGroupCellRenderer: IsCompletedGroupCellRenderer,
            isFeaturedCellRenderer: IsFeaturedCellRenderer,
            isFeaturedGroupCellRenderer: IsFeaturedGroupCellRenderer,
            contentCellRenderer: ContentCellRenderer,
            dailyDateCellRenderer: DailyDateCellRenderer,
            dailyDateGroupCellRenderer: DailyDateGroupCellRenderer,
            goalsCellRenderer: GoalsCellRenderer,
            goalsGroupCellRenderer: GoalsGroupCellRenderer,
        }),
        []
    );
};
