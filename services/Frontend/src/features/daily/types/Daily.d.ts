export type Daily = {
    id: string;
    date: string;
};

export type DailyActivity = {
    date: string;
    entriesCount: number;
};

export type DailyMetrics = {
    dailyRange: {
        from: string;
        to: string;
    };
    activityHistory: DailyActivity[];
    totalActiveDays: number;
    activeDayRate: number;
    meanActivityPerDay: number;
    currentActivityStreak: number | null;
    longestActivityStreak: number;
};
