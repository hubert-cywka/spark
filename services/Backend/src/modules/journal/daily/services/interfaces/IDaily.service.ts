import { PageOptions } from "@/common/pagination/types/PageOptions";
import { Paginated } from "@/common/pagination/types/Paginated";
import { type Daily } from "@/modules/journal/daily/models/Daily.model";
import { type ISODateString } from "@/types/Date";

export const DailyServiceToken = Symbol("DailyServiceToken");

export interface IDailyService {
    findAllByDateRange(authorId: string, from: ISODateString, to: ISODateString, pageOptions: PageOptions): Promise<Paginated<Daily>>;
    findOneById(authorId: string, dailyId: string): Promise<Daily>;
    create(authorId: string, date: ISODateString): Promise<Daily>;
    update(authorId: string, dailyId: string, date: string): Promise<Daily>;
    deleteById(authorId: string, dailyId: string): Promise<void>;
    restoreById(authorId: string, dailyId: string): Promise<void>;
}
