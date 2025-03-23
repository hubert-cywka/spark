export type EntriesInsights = {
    dailyRange: {
        from: string;
        to: string;
    };
    totalEntriesAmount: number;
    pendingEntriesAmount: number;
    completedEntriesAmount: number;
    completedEntriesRatio: number;
    featuredEntriesAmount: number;
    featuredEntriesRatio: number;
};
