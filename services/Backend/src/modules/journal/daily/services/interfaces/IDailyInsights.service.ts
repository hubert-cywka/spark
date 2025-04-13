import { DailyInsights } from "@/modules/journal/daily/models/DailyInsights.model";
import { ISODateStringRange } from "@/types/Date";

export const DailyActivityServiceToken = Symbol("DailyActivityService");

export interface IDailyInsightsService {
    findByDateRange(authorId: string, dateRange: ISODateStringRange, timezone?: string): Promise<DailyInsights>;
}
