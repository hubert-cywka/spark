export type RawInsight<T = string> = {
    key: string;
    score: {
        value: number;
        key: T;
    };
};

export type Insight = {
    key: string;
    score: number;
    description: string;
};

export type MetricsRatingData = {
    totalEntriesAmount: number;
    activeDayRate: number;
    featuredEntriesRatio: number;
    completedEntriesRatio: number;
    currentDailyStreak: number | null;
};
