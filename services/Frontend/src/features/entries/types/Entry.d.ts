import { Day } from "@/types/Day.ts";

export type Entry = {
    id: string;
    dailyId: string;
    authorId: string;
    content: string;
    isCompleted: boolean;
    isFeatured: boolean;
    createdAt: Date;
};

export type EntriesMetrics = {
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

export type EntryLoggingHistogram = {
    dailyRange: {
        from: string;
        to: string;
    };
    days: {
        dayOfWeek: Day;
        hours: { hour: number; count: number }[];
    }[];
};

export type EntryFilters = {
    completed?: boolean;
    featured?: boolean;
};
