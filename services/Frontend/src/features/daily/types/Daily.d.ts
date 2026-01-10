import { ISODateString, ISODateStringRange } from "@/types/ISODateString";

export type Daily = {
    id: string;
    date: ISODateString;
};

export type DailyActivity = {
    date: string;
    entriesCount: number;
};

export type DailyMetrics = {
    dailyRange: ISODateStringRange;
    activityHistory: DailyActivity[];
    totalActiveDays: number;
    activeDayRate: number;
    meanActivityPerDay: number;
    currentActivityStreak: number | null;
    longestActivityStreak: number;
};
