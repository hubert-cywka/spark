import { PageOptions } from "@/common/pagination/types/PageOptions";
import { Paginated } from "@/common/pagination/types/Paginated";
import { Entry } from "@/modules/journal/entries/models/Entry.model";
import { EntryDetail } from "@/modules/journal/entries/models/EntryDetail.model";
import { EntryDetailFilters } from "@/modules/journal/entries/models/EntryDetailFilters.model";
import { type EntryFilters } from "@/modules/journal/entries/models/EntryFilters.model";

export const EntryServiceToken = Symbol("EntryService");

export interface IEntryService {
    findAll(authorId: string, pageOptions: PageOptions, filters?: EntryFilters): Promise<Paginated<Entry>>;
    findAllDetailed(authorId: string, pageOptions: PageOptions, filters: EntryDetailFilters): Promise<Paginated<EntryDetail>>;

    create(authorId: string, dailyId: string, entry: Pick<Entry, "content" | "isCompleted" | "isFeatured">): Promise<Entry>;
    deleteById(authorId: string, dailyId: string, entryId: string): Promise<void>;
    restoreById(authorId: string, dailyId: string, entryId: string): Promise<void>;
    update(authorId: string, dailyId: string, entryId: string, entry: Partial<Entry>): Promise<Entry>;
}
