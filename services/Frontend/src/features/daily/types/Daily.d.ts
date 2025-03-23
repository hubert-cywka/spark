export type Daily = {
    id: string;
    date: string;
};

export type DailyActivity = {
    date: string;
    entriesCount: number;
};

export type DailyInsights = {
    dailyRange: {
        from: string;
        to: string;
    };
    activityHistory: DailyActivity[];
    totalActiveDays: number;
    meanActivityPerDay: number;
    currentActivityStreak: number;
    longestActivityStreak: number;
};
