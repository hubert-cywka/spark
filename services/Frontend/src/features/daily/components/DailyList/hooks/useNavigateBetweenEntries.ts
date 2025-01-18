import { getEntryElementId, getEntryPlaceholderElementId } from "@/features/daily/components/DailyList/utils/dailyEntriesSelectors";
import { Entry } from "@/features/entries/types/Entry";
import { onNextTick } from "@/utils/onNextTick";

export type DailyEntryColumn = "input" | "checkbox" | "goals";

type UseNavigationBetweenEntries = {
    entriesByDaily: Record<string, Entry[]>;
    onBottomReached: (dailyId: string) => void;
    onBottomLeft: (dailyId: string) => void;
};

export const useNavigationBetweenEntries = ({ entriesByDaily, onBottomLeft, onBottomReached }: UseNavigationBetweenEntries) => {
    const navigateByEntryId = (column: DailyEntryColumn, entryId: string) => {
        getEntryFocusableElement(column, entryId)?.focus();
    };

    const navigateByIndex = (column: DailyEntryColumn, dailyId: string, targetIndex: number) => {
        const entries = entriesByDaily[dailyId];

        if (!entries || targetIndex < 0) {
            onNextTick(() => getEntryPlaceholderFocusableElement("input", dailyId)?.focus());
            return;
        }

        if (targetIndex >= entries.length) {
            onBottomReached(dailyId);
            onNextTick(() => getEntryPlaceholderFocusableElement("input", dailyId)?.focus());
            return;
        }

        onBottomLeft(dailyId);
        const targetEntry = entries[targetIndex];
        getEntryFocusableElement(column, targetEntry.id)?.focus();
    };

    return { navigateByEntryId, navigateByIndex };
};

const getEntryFocusableElement = (column: DailyEntryColumn, entryId: string) => {
    return document.querySelector(`#${getEntryElementId(entryId)} > [data-entry-column="${column}"]`) as HTMLElement | null;
};

const getEntryPlaceholderFocusableElement = (column: DailyEntryColumn, dailyId: string) => {
    return document.querySelector(`#${getEntryPlaceholderElementId(dailyId)} > [data-entry-column="${column}"]`) as HTMLElement | null;
};
