import { DailyActivityDto } from "@/features/daily/api/dto/DailyActivityDto";
import { ISODateStringRange } from "@/types/ISODateString";

export type DailyMetricsDto = {
    dailyRange: ISODateStringRange;
    activityHistory: DailyActivityDto[];
    totalActiveDays: number;
    activeDayRate: number;
    meanActivityPerDay: number;
    currentActivityStreak: number | null;
    longestActivityStreak: number;
};
