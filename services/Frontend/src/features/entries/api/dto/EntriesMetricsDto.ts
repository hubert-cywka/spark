export type EntriesMetricsDto = {
    dailyRange: {
        from: string;
        to: string;
    };
    completedEntriesAmount: number;
    completedEntriesRatio: number;
    pendingEntriesAmount: number;
    featuredEntriesAmount: number;
    featuredEntriesRatio: number;
    totalEntriesAmount: number;
};
