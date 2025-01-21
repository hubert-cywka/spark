import { useUpdateEntryStatusEvents } from "@/features/entries/hooks";
import {
    useCreateEntry,
    useCreateEntryEvents,
    useDeleteEntry,
    useDeleteEntryEvents,
    useUpdateEntryContent,
    useUpdateEntryContentEvents,
    useUpdateEntryStatus,
} from "@/features/entries/hooks/";
import { Entry } from "@/features/entries/types/Entry";

export const useDailyEntriesEvents = () => {
    const { mutateAsync: createEntry } = useCreateEntry();
    const { onCreateEntryError } = useCreateEntryEvents();

    const { mutateAsync: updateEntryContent } = useUpdateEntryContent();
    const { onUpdateEntryContentError } = useUpdateEntryContentEvents();

    const { mutateAsync: deleteEntry } = useDeleteEntry();
    const { onDeleteEntryError } = useDeleteEntryEvents();

    const { mutateAsync: updateEntryStatus } = useUpdateEntryStatus();
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
