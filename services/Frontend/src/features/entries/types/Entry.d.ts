import { Day } from "@/types/Day.ts";
import { ISODateString } from "@/types/ISODateString";

export type Entry = {
    id: string;
    dailyId: string;
    authorId: string;
    content: string;
    isCompleted: boolean;
    isFeatured: boolean;
    updatedAt: Date;
    createdAt: Date;
};

export type EntryDetail = {
    id: string;
    daily: ISODateString;
    content: string;
    isCompleted: boolean;
    isFeatured: boolean;
    goals: string[];
};

export type EntriesMetrics = {
    dailyRange: {
        from: ISODateString;
        to: ISODateString;
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
        from: ISODateString;
        to: ISODateString;
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
