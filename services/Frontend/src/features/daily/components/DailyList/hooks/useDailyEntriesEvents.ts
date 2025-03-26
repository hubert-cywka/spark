import { useUpdateEntryIsFeatured, useUpdateEntryIsFeaturedEvents, useUpdateEntryStatusEvents } from "@/features/entries/hooks";
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

    const { mutateAsync: updateEntryIsFeatured } = useUpdateEntryIsFeatured();
    const { onUpdateEntryIsFeaturedError } = useUpdateEntryIsFeaturedEvents();

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

    const onUpdateEntryIsFeatured = async (entry: Entry, isFeatured: boolean) => {
        try {
            return await updateEntryIsFeatured({
                entryId: entry.id,
                dailyId: entry.dailyId,
                isFeatured,
            });
        } catch (err) {
            onUpdateEntryIsFeaturedError(err);
        }
    };

    const onCreateEntry = async (dailyId: string, entry: Pick<Entry, "content" | "isCompleted" | "isFeatured">) => {
        try {
            return await createEntry({ dailyId, ...entry });
        } catch (err) {
            onCreateEntryError(err);
        }
    };

    return {
        onCreateEntry,
        onUpdateEntryContent,
        onDeleteEntry,
        onUpdateEntryStatus,
        onUpdateEntryIsFeatured,
    };
};
