import { DailyActivityDto } from "@/modules/journal/daily/dto/DailyActivity.dto";

export type DailyInsights = {
    dailyRange: {
        from: string;
        to: string;
    };
    activityHistory: DailyActivityDto[];
    totalActiveDays: number;
    activeDayRate: number;
    meanActivityPerDay: number;
    currentActivityStreak: number | null;
    longestActivityStreak: number;
};
