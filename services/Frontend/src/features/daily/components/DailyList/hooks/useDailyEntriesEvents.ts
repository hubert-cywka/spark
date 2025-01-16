import { QueryKey } from "@tanstack/react-query";

import { useCreateEntry } from "@/features/entries/hooks/useCreateEntry";
import { useCreateEntryEvents } from "@/features/entries/hooks/useCreateEntryEvents";
import { useDeleteEntry } from "@/features/entries/hooks/useDeleteEntry";
import { useDeleteEntryEvents } from "@/features/entries/hooks/useDeleteEntryEvents";
import { useUpdateEntryContent } from "@/features/entries/hooks/useUpdateEntryContent";
import { useUpdateEntryContentEvents } from "@/features/entries/hooks/useUpdateEntryContentEvents";
import { Entry } from "@/features/entries/types/Entry";
import { onNextTick } from "@/utils/onNextTick";

type UseDailyEntriesEvents = {
    queryKey: QueryKey;
    onEntryFocus: (entryId: string) => void;
};

export const useDailyEntriesEvents = ({ queryKey, onEntryFocus }: UseDailyEntriesEvents) => {
    const { mutateAsync: createEntry } = useCreateEntry({ queryKey });
    const { onCreateEntryError } = useCreateEntryEvents();

    const { mutateAsync: updateEntryContent } = useUpdateEntryContent({
        queryKey,
    });
    const { onUpdateEntryContentError } = useUpdateEntryContentEvents();

    const { mutateAsync: deleteEntry } = useDeleteEntry({ queryKey });
    const { onDeleteEntryError } = useDeleteEntryEvents();

    const onDeleteEntry = async (dailyId: string, entryId: string) => {
        try {
            await deleteEntry({ entryId, dailyId });
        } catch (err) {
            onDeleteEntryError(err);
        }
    };

    const onUpdateEntryContent = async (entry: Entry, newContent: string) => {
        try {
            await updateEntryContent({
                entryId: entry.id,
                dailyId: entry.dailyId,
                content: newContent,
            });
        } catch (err) {
            onUpdateEntryContentError(err);
        }
    };

    const onCreateEntry = async (dailyId: string, content: string) => {
        try {
            const result = await createEntry({ dailyId, content });
            onNextTick(() => onEntryFocus(result.id));
        } catch (err) {
            onCreateEntryError(err);
        }
    };

    return { onCreateEntry, onUpdateEntryContent, onDeleteEntry };
};
