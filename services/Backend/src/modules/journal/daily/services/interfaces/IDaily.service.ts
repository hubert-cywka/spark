import { PageOptions } from "@/common/pagination/types/PageOptions";
import { Paginated } from "@/common/pagination/types/Paginated";
import { type Daily } from "@/modules/journal/daily/models/Daily.model";

export const DailyServiceToken = Symbol("DailyServiceToken");

export interface IDailyService {
    findAllByDateRange(authorId: string, from: string, to: string, pageOptions: PageOptions): Promise<Paginated<Daily>>;
    findOneById(authorId: string, dailyId: string): Promise<Daily>;
    create(authorId: string, date: string): Promise<Daily>;
    update(authorId: string, dailyId: string, date: string): Promise<Daily>;
    deleteById(authorId: string, dailyId: string): Promise<void>;
    restoreById(authorId: string, dailyId: string): Promise<void>;
}
