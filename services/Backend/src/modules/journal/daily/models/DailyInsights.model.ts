import { DailyActivityDto } from "@/modules/journal/daily/dto/DailyActivity.dto";

export type DailyInsights = {
    dailyRange: {
        from: string;
        to: string;
    };
    activityHistory: DailyActivityDto[];
    totalActiveDays: number;
    meanActivityPerDay: number;
    currentActivityStreak: number;
    longestActivityStreak: number;
};
