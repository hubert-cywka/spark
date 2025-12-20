import { PageOptions } from "@/common/pagination/types/PageOptions";
import { Paginated } from "@/common/pagination/types/Paginated";
import { type Daily } from "@/modules/journal/daily/models/Daily.model";
import { type ISODateString } from "@/types/Date";

export const DailyProviderServiceToken = Symbol("DailyProviderServiceToken");

export interface IDailyProviderService {
    findAllByDateRange(authorId: string, from: ISODateString, to: ISODateString, pageOptions: PageOptions): Promise<Paginated<Daily>>;
    findOneById(authorId: string, dailyId: string): Promise<Daily>;
    existsById(authorId: string, dailyId: string): Promise<boolean>;
}
