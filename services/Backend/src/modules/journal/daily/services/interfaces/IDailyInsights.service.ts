import { DailyMetrics } from "@/modules/journal/daily/models/DailyMetrics.model";
import { type ISODateStringRange } from "@/types/Date";

export const DailyActivityServiceToken = Symbol("DailyActivityService");

export interface IDailyInsightsService {
    findMetricsByDateRange(authorId: string, dateRange: ISODateStringRange, timezone?: string): Promise<DailyMetrics>;
}
