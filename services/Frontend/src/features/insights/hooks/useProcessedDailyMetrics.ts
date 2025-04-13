import { useDailyMetrics } from "@/features/daily/hooks/useDailyMetrics.ts";
import { accumulateEntries, calculateHistogram, distributeEntriesByDayOfWeek } from "@/features/daily/utils/chartUtils.ts";
import { useTranslateWeekday } from "@/hooks/useTranslateWeekday.ts";
import { ISODateStringRange } from "@/types/ISODateString";

type UseDailyMetricsOptions = {
    dateRange: ISODateStringRange;
};

export const useProcessedDailyMetrics = ({ dateRange }: UseDailyMetricsOptions) => {
    const translateWeekday = useTranslateWeekday();
    const { data: dailyMetrics } = useDailyMetrics(dateRange);

    if (!dailyMetrics) {
        return null;
    }

    const dailyActivityHistogram = dailyMetrics ? calculateHistogram(dailyMetrics.activityHistory) : null;
    const entriesAccumulatedByDays = dailyMetrics ? accumulateEntries(dailyMetrics.activityHistory) : null;

    const entriesLoggedForDay = dailyMetrics
        ? distributeEntriesByDayOfWeek(dailyMetrics.activityHistory).map(({ key, ...rest }) => {
              return { ...rest, key: translateWeekday(key) };
          })
        : null;

    return {
        entriesLoggedForDay,
        entriesAccumulatedByDays,
        dailyActivityHistogram,
        ...dailyMetrics,
    };
};
