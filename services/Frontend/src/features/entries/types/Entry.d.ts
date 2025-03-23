export type Entry = {
    id: string;
    dailyId: string;
    authorId: string;
    content: string;
    isCompleted: boolean;
    isFeatured: boolean;
    createdAt: Date;
};

export type EntriesInsights = {
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
