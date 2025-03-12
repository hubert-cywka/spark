import { DailyActivity } from "@/modules/journal/daily/models/DailyActivity.model";

export const DailyActivityServiceToken = Symbol("DailyActivityService");

export interface IDailyActivityService {
    getByDateRange(authorId: string, from: string, to: string): Promise<DailyActivity[]>;
}
