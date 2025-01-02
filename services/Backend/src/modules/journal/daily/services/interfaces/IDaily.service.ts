import { Daily } from "@/modules/journal/daily/models/Daily.model";
import { User } from "@/types/User";

export const DailyServiceToken = Symbol("DailyServiceToken");

export interface IDailyService {
    findAllByDateRange(author: User, from: Date, to: Date): Promise<Daily[]>;
    findOneById(author: User, id: string): Promise<Daily>;
    create(author: User, date: Date): Promise<Daily>;
    update(author: User, id: string, date: Date): Promise<Daily>;
    deleteById(author: User, id: string): Promise<void>;
}
