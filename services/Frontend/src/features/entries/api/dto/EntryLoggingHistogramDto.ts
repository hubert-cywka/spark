import { ISODateString } from "@/types/ISODateString";

export type EntryLoggingHistogramDto = {
    dailyRange: {
        from: ISODateString;
        to: ISODateString;
    };
    days: {
        dayOfWeek: number;
        hours: { hour: number; count: number }[];
    }[];
};
