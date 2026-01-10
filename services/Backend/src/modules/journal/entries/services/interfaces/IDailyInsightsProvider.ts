import { DailyMetrics } from "@/modules/journal/entries/models/DailyMetrics.model";
import { type ISODateStringRange } from "@/types/Date";

export const DailyInsightsProviderToken = Symbol("DailyInsightsProvider");

export interface IDailyInsightsProvider {
    findMetricsByDateRange(authorId: string, dateRange: ISODateStringRange, timezone?: string): Promise<DailyMetrics>;
}
