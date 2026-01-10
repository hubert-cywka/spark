import { PageOptions } from "@/common/pagination/types/PageOptions";
import { Paginated } from "@/common/pagination/types/Paginated";
import { Entry } from "@/modules/journal/entries/models/Entry.model";
import { type EntryFilters } from "@/modules/journal/entries/models/EntryFilters.model";

export const EntryServiceToken = Symbol("EntryService");

export interface IEntryService {
    findAll(authorId: string, pageOptions: PageOptions, filters?: EntryFilters): Promise<Paginated<Entry>>;
    create(authorId: string, entry: Pick<Entry, "date" | "content" | "isCompleted" | "isFeatured">): Promise<Entry>;

    deleteById(authorId: string, entryId: string): Promise<void>;
    bulkDelete(authorId: string, entriesIds: string[]): Promise<void>;
    restoreById(authorId: string, entryId: string): Promise<void>;

    update(authorId: string, entryId: string, entry: Partial<Entry>): Promise<Entry>;
    bulkUpdate(authorId: string, entriesIds: string[], value: Partial<Entry>): Promise<Entry[]>;
}
