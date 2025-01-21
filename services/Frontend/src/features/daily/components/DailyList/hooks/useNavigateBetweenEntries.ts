import { getEntryElementId, getEntryPlaceholderElementId } from "@/features/daily/components/DailyList/utils/dailyEntriesSelectors";
import { Entry } from "@/features/entries/types/Entry";
import { onNextTick } from "@/utils/onNextTick";

export type DailyEntryColumn = "input" | "checkbox" | "expand";

type UseNavigationBetweenEntries = {
    entriesGroups: Record<string, Entry[]>;
    onBottomReached?: (group: string) => void;
    onBottomLeft?: (group: string) => void;
};

export const useNavigationBetweenEntries = ({ entriesGroups, onBottomLeft, onBottomReached }: UseNavigationBetweenEntries) => {
    const navigateByEntryId = (column: DailyEntryColumn, entryId: string) => {
        getEntryFocusableElement(column, entryId)?.focus();
    };

    const navigateByIndex = (column: DailyEntryColumn, group: string, targetIndex: number) => {
        const entries = entriesGroups[group];

        if (!entries?.length || targetIndex < 0) {
            onNextTick(() => getEntryPlaceholderFocusableElement("input", group)?.focus());
            return;
        }

        if (targetIndex >= entries.length) {
            onBottomReached?.(group);
            onNextTick(() => getEntryPlaceholderFocusableElement("input", group)?.focus());
            return;
        }

        onBottomLeft?.(group);
        const targetEntry = entries[targetIndex];
        getEntryFocusableElement(column, targetEntry.id)?.focus();
    };

    return { navigateByEntryId, navigateByIndex };
};

const getEntryFocusableElement = (column: DailyEntryColumn, entryId: string) => {
    return document.querySelector(`#${getEntryElementId(entryId)} [data-entry-column="${column}"]`) as HTMLElement | null;
};

const getEntryPlaceholderFocusableElement = (column: DailyEntryColumn, group: string) => {
    return document.querySelector(`#${getEntryPlaceholderElementId(group)} [data-entry-column="${column}"]`) as HTMLElement | null;
};
