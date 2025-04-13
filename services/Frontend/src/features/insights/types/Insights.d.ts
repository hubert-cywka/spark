export type Insight = {
    score: number;
    description: string;
    key: string;
};

export type MetricsRatingData = {
    totalEntriesAmount: number;
    featuredEntriesRatio: number;
    completedEntriesRatio: number;
    currentDailyStreak: number | null;
};
