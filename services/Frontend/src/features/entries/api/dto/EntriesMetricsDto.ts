import { ISODateString } from "@/types/ISODateString";

export type EntriesMetricsDto = {
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
