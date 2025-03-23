import { DailyInsights } from "@/modules/journal/daily/models/DailyInsights.model";

export const DailyActivityServiceToken = Symbol("DailyActivityService");

export interface IDailyInsightsService {
    findByDateRange(authorId: string, from: string, to: string): Promise<DailyInsights>;
}
