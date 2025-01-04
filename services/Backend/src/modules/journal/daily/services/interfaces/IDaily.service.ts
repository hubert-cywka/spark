import { PageOptions } from "@/common/pagination/types/PageOptions";
import { Paginated } from "@/common/pagination/types/Paginated";
import { type Daily } from "@/modules/journal/daily/models/Daily.model";
import { type User } from "@/types/User";

export const DailyServiceToken = Symbol("DailyServiceToken");

export interface IDailyService {
    findAllByDateRange(author: User, from: string, to: string, pageOptions: PageOptions): Promise<Paginated<Daily>>;
    findOneById(author: User, id: string): Promise<Daily>;
    create(author: User, date: string): Promise<Daily>;
    update(author: User, id: string, date: string): Promise<Daily>;
    deleteById(author: User, id: string): Promise<void>;
}
