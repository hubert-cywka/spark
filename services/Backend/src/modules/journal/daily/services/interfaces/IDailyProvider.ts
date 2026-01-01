import { PageOptions } from "@/common/pagination/types/PageOptions";
import { Paginated } from "@/common/pagination/types/Paginated";
import { type Daily } from "@/modules/journal/daily/models/Daily.model";
import { type ISODateString } from "@/types/Date";

export const DailyProviderToken = Symbol("DailyProviderToken");

export interface IDailyProvider {
    findAllByDateRange(authorId: string, from: ISODateString, to: ISODateString, pageOptions: PageOptions): Promise<Paginated<Daily>>;
    getById(authorId: string, dailyId: string): Promise<Daily>;
    existsById(authorId: string, dailyId: string): Promise<boolean>;
}
