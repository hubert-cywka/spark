import { useDailyInsights } from "@/features/daily/hooks/useDailyInsights.ts";
import { accumulateEntries, calculateHistogram, distributeEntriesByDayOfWeek } from "@/features/daily/utils/chartUtils.ts";
import { useTranslateWeekday } from "@/hooks/useTranslateWeekday.ts";
import { ISODateStringRange } from "@/types/ISODateString";

type UseDailyMetricsOptions = {
    dateRange: ISODateStringRange;
};

export const useProcessedDailyMetrics = ({ dateRange }: UseDailyMetricsOptions) => {
    const translateWeekday = useTranslateWeekday();
    const { data: dailyInsights } = useDailyInsights(dateRange);

    if (!dailyInsights) {
        return null;
    }

    const dailyActivityHistogram = dailyInsights ? calculateHistogram(dailyInsights.activityHistory) : null;
    const entriesAccumulatedByDays = dailyInsights ? accumulateEntries(dailyInsights.activityHistory) : null;

    const entriesLoggedForDay = dailyInsights
        ? distributeEntriesByDayOfWeek(dailyInsights.activityHistory).map(({ key, ...rest }) => {
              return { ...rest, key: translateWeekday(key) };
          })
        : null;

    return {
        entriesLoggedForDay,
        entriesAccumulatedByDays,
        dailyActivityHistogram,
        ...dailyInsights,
    };
};
