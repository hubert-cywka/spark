import {
    useCreateEntry,
    useCreateEntryEvents,
    useDeleteEntry,
    useDeleteEntryEvents,
    useUpdateEntry,
    useUpdateEntryEvents,
} from "@/features/entries/hooks/";
import { useBulkDeleteEntries } from "@/features/entries/hooks/useDeleteEntry/useBulkDeleteEntries.ts";
import { useBulkDeleteEntriesEvents } from "@/features/entries/hooks/useDeleteEntry/useBulkDeleteEntriesEvents.ts";
import { useBulkUpdateEntries } from "@/features/entries/hooks/useUpdateEntry/useBulkUpdateEntries.ts";
import { useBulkUpdateEntriesEvents } from "@/features/entries/hooks/useUpdateEntry/useBulkUpdateEntriesEvents.ts";
import { Entry } from "@/features/entries/types/Entry";
import { ISODateString } from "@/types/ISODateString";

export const useEntriesEvents = () => {
    const { mutateAsync: createEntry } = useCreateEntry();
    const { onCreateEntryError } = useCreateEntryEvents();

    const { mutateAsync: deleteEntry } = useDeleteEntry();
    const { onDeleteEntryError } = useDeleteEntryEvents();

    const { mutateAsync: deleteEntries } = useBulkDeleteEntries();
    const { onDeleteEntriesError } = useBulkDeleteEntriesEvents();

    const { mutateAsync: updateEntry } = useUpdateEntry();
    const { onUpdateEntryError } = useUpdateEntryEvents();

    const { mutateAsync: updateEntries } = useBulkUpdateEntries();
    const { onUpdateEntriesError } = useBulkUpdateEntriesEvents();

    const onDeleteEntry = async (entryId: string) => {
        try {
            return await deleteEntry({ entryId });
        } catch (err) {
            onDeleteEntryError(err);
        }
    };

    const onDeleteEntries = async (ids: string[]) => {
        try {
            return await deleteEntries({ ids });
        } catch (err) {
            onDeleteEntriesError(err);
        }
    };

    const onUpdateEntries = async (ids: string[], value: Partial<Entry>) => {
        try {
            return await updateEntries({ ids, value });
        } catch (err) {
            onUpdateEntriesError(err);
        }
    };

    const onUpdateEntryContent = async (entryId: string, newContent: string) => {
        try {
            return await updateEntry({
                entryId,
                content: newContent,
            });
        } catch (err) {
            onUpdateEntryError(err);
        }
    };

    const onUpdateEntryDate = async (entryId: string, newDate: ISODateString) => {
        try {
            return await updateEntry({
                entryId,
                date: newDate,
            });
        } catch (err) {
            onUpdateEntryError(err);
        }
    };

    const onUpdateEntryStatus = async (entryId: string, newStatus: boolean) => {
        try {
            return await updateEntry({
                entryId,
                isCompleted: newStatus,
            });
        } catch (err) {
            onUpdateEntryError(err);
        }
    };

    const onUpdateEntryIsFeatured = async (entryId: string, isFeatured: boolean) => {
        try {
            return await updateEntry({
                entryId,
                isFeatured,
            });
        } catch (err) {
            onUpdateEntryError(err);
        }
    };

    const onCreateEntry = async (entry: Pick<Entry, "date" | "content" | "isCompleted" | "isFeatured">) => {
        try {
            return await createEntry(entry);
        } catch (err) {
            onCreateEntryError(err);
        }
    };

    return {
        onCreateEntry,
        onDeleteEntry,
        onDeleteEntries,
        onUpdateEntries,
        onUpdateEntryDate,
        onUpdateEntryContent,
        onUpdateEntryStatus,
        onUpdateEntryIsFeatured,
    };
};
