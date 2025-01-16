import {
    getEntryFocusableElement,
    getEntryPlaceholderFocusableElement,
} from "@/features/daily/components/DailyList/utils/dailyEntriesSelectors";
import { Entry } from "@/features/entries/types/Entry";
import { onNextTick } from "@/utils/onNextTick";

type UseNavigationBetweenEntries = {
    entriesByDaily: Record<string, Entry[]>;
    onBottomReached: (dailyId: string) => void;
    onBottomLeft: (dailyId: string) => void;
};

export const useNavigationBetweenEntries = ({ entriesByDaily, onBottomLeft, onBottomReached }: UseNavigationBetweenEntries) => {
    const navigateByEntryId = (entryId: string) => {
        getEntryFocusableElement(entryId)?.focus();
    };

    const navigateByIndex = (dailyId: string, targetIndex: number) => {
        const entries = entriesByDaily[dailyId];

        if (!entries || targetIndex < 0) {
            onNextTick(() => getEntryPlaceholderFocusableElement(dailyId)?.focus());
            return;
        }

        if (targetIndex >= entries.length) {
            onBottomReached(dailyId);
            onNextTick(() => getEntryPlaceholderFocusableElement(dailyId)?.focus());
            return;
        }

        onBottomLeft(dailyId);
        const targetEntry = entries[targetIndex];
        getEntryFocusableElement(targetEntry.id)?.focus();
    };

    return { navigateByEntryId, navigateByIndex };
};
