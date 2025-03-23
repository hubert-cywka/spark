import { ChartData } from "@/components/Chart/types/Chart";
import { DailyActivity } from "@/features/daily/types/Daily";
import { Day } from "@/types/Day";

export const accumulateEntries = (activityHistory: DailyActivity[]): ChartData => {
    let accumulated = 0;

    return activityHistory.map(({ date, entriesCount }) => {
        accumulated += entriesCount;
        return { key: date, value: accumulated };
    });
};

export const distributeEntriesByDayOfWeek = (activityHistory: DailyActivity[]): { key: Day; value: number }[] => {
    const daysOfWeek: Record<string, number> = {
        [Day.SUNDAY]: 0,
        [Day.MONDAY]: 0,
        [Day.TUESDAY]: 0,
        [Day.WEDNESDAY]: 0,
        [Day.THURSDAY]: 0,
        [Day.FRIDAY]: 0,
        [Day.SATURDAY]: 0,
    };

    activityHistory.forEach(({ date, entriesCount }) => {
        daysOfWeek[new Date(date).getDay()] += entriesCount;
    });

    return Object.entries(daysOfWeek).map(([key, value]) => ({
        key: parseInt(key),
        value,
    }));
};

export const calculateHistogram = (activityHistory: DailyActivity[], binSize: number = 1): ChartData => {
    const bins: Record<string, number> = {};

    activityHistory.forEach(({ entriesCount }) => {
        const bin = Math.floor(entriesCount / binSize) * binSize;
        const binLabel = binSize === 1 ? bin : `${bin} - ${bin + binSize - 1}`;

        bins[binLabel] = (bins[binLabel] || 0) + 1;
    });

    return Object.entries(bins)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .map(([key, value]) => ({ key, value }));
};
