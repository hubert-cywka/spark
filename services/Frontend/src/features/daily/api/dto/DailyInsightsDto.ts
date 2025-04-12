import { DailyActivityDto } from "@/features/daily/api/dto/DailyActivityDto";

export type DailyInsightsDto = {
    dailyRange: {
        from: string;
        to: string;
    };
    activityHistory: DailyActivityDto[];
    totalActiveDays: number;
    activeDayRate: number;
    meanActivityPerDay: number;
    currentActivityStreak: number;
    longestActivityStreak: number;
};
