import { QueryKey } from "@tanstack/react-query";

import { useCreateEntry } from "@/features/entries/hooks/useCreateEntry";
import { useCreateEntryEvents } from "@/features/entries/hooks/useCreateEntryEvents";
import { useDeleteEntry } from "@/features/entries/hooks/useDeleteEntry";
import { useDeleteEntryEvents } from "@/features/entries/hooks/useDeleteEntryEvents";
import { useUpdateEntryContent } from "@/features/entries/hooks/useUpdateEntryContent";
import { useUpdateEntryContentEvents } from "@/features/entries/hooks/useUpdateEntryContentEvents";
import { useUpdateEntryStatus } from "@/features/entries/hooks/useUpdateEntryStatus";
import { useUpdateEntryStatusEvents } from "@/features/entries/hooks/useUpdateEntryStatusEvents";
import { Entry } from "@/features/entries/types/Entry";

type UseDailyEntriesEvents = {
    queryKey: QueryKey;
};

export const useDailyEntriesEvents = ({ queryKey }: UseDailyEntriesEvents) => {
    const { mutateAsync: createEntry } = useCreateEntry({ queryKey });
    const { onCreateEntryError } = useCreateEntryEvents();

    const { mutateAsync: updateEntryContent } = useUpdateEntryContent({
        queryKey,
    });
    const { onUpdateEntryContentError } = useUpdateEntryContentEvents();

    const { mutateAsync: deleteEntry } = useDeleteEntry({ queryKey });
    const { onDeleteEntryError } = useDeleteEntryEvents();

    const { mutateAsync: updateEntryStatus } = useUpdateEntryStatus({
        queryKey,
    });
    const { onUpdateEntryStatusError } = useUpdateEntryStatusEvents();

    const onDeleteEntry = async (dailyId: string, entryId: string) => {
        try {
            return await deleteEntry({ entryId, dailyId });
        } catch (err) {
            onDeleteEntryError(err);
        }
    };

    const onUpdateEntryContent = async (entry: Entry, newContent: string) => {
        try {
            return await updateEntryContent({
                entryId: entry.id,
                dailyId: entry.dailyId,
                content: newContent,
            });
        } catch (err) {
            onUpdateEntryContentError(err);
        }
    };

    const onUpdateEntryStatus = async (entry: Entry, newStatus: boolean) => {
        try {
            return await updateEntryStatus({
                entryId: entry.id,
                dailyId: entry.dailyId,
                isCompleted: newStatus,
            });
        } catch (err) {
            onUpdateEntryStatusError(err);
        }
    };

    const onCreateEntry = async (dailyId: string, content: string) => {
        try {
            return await createEntry({ dailyId, content });
        } catch (err) {
            onCreateEntryError(err);
        }
    };

    return {
        onCreateEntry,
        onUpdateEntryContent,
        onDeleteEntry,
        onUpdateEntryStatus,
    };
};
