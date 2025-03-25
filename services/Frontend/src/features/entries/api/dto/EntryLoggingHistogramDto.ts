export type EntryLoggingHistogramDto = {
    dailyRange: {
        from: string;
        to: string;
    };
    days: {
        dayOfWeek: number;
        hours: { hour: number; count: number }[];
    }[];
};
