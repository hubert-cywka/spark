import { PageOptions } from "@/common/pagination/types/PageOptions";
import { Paginated } from "@/common/pagination/types/Paginated";
import { Entry } from "@/modules/journal/entries/models/Entry.model";
import { type EntryFilters } from "@/modules/journal/entries/models/EntryFilters.model";

export const EntryServiceToken = Symbol("EntryService");

export interface IEntryService {
    findAll(authorId: string, pageOptions: PageOptions, filters?: EntryFilters): Promise<Paginated<Entry>>;
    create(authorId: string, dailyId: string, content: string): Promise<Entry>;
    deleteById(authorId: string, dailyId: string, entryId: string): Promise<void>;
    restoreById(authorId: string, dailyId: string, entryId: string): Promise<void>;
    updateContent(authorId: string, dailyId: string, entryId: string, content: string): Promise<Entry>;
    updateStatus(authorId: string, dailyId: string, entryId: string, isCompleted: boolean): Promise<Entry>;
}
