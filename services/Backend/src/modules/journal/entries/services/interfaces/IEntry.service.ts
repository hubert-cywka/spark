import { PageOptions } from "@/common/pagination/types/PageOptions";
import { Paginated } from "@/common/pagination/types/Paginated";
import { Entry } from "@/modules/journal/entries/models/Entry.model";

export const EntryServiceToken = Symbol("EntryService");

export interface IEntryService {
    findAllByDateRange(authorId: string, from: string, to: string, pageOptions: PageOptions): Promise<Paginated<Entry>>;
    create(authorId: string, dailyId: string, content: string): Promise<Entry>;
    updateContent(authorId: string, dailyId: string, entryId: string, content: string): Promise<Entry>;
    deleteById(authorId: string, dailyId: string, entryId: string): Promise<void>;
}
