import { DailyActivityDto } from "@/modules/journal/entries/dto/DailyActivity.dto";
import { type ISODateStringRange } from "@/types/Date";

export type DailyMetrics = {
    dailyRange: ISODateStringRange;
    activityHistory: DailyActivityDto[];
    totalActiveDays: number;
    activeDayRate: number;
    meanActivityPerDay: number;
    currentActivityStreak: number | null;
    longestActivityStreak: number;
};
