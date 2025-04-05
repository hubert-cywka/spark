import { useEntriesMetrics, useEntryLoggingHistogram } from "@/features/entries/hooks";
import { useTranslateWeekday } from "@/hooks/useTranslateWeekday.ts";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";
import { ISODateStringRange } from "@/types/ISODateString";
import { round } from "@/utils/round.ts";

type UseEntryMetricsOptions = {
    dateRange: ISODateStringRange;
};

export const useProcessedEntryMetrics = ({ dateRange }: UseEntryMetricsOptions) => {
    const translateWeekday = useTranslateWeekday();
    const t = useTranslate();

    const { data: entriesMetrics } = useEntriesMetrics({
        from: dateRange.from,
        to: dateRange.to,
    });

    const { data: histogram } = useEntryLoggingHistogram({
        from: dateRange.from,
        to: dateRange.to,
    });

    if (!entriesMetrics) {
        return null;
    }

    const entryLoggingData = !histogram
        ? null
        : histogram.days.flatMap((day) =>
              day.hours.flatMap(({ hour, count }) => ({
                  key: `${translateWeekday(day.dayOfWeek)}, ${hour}-${hour + 1}`,
                  value: count,
              }))
          );

    const featuredEntriesRatio = entriesMetrics
        ? [
              {
                  key: t("insights.charts.featuredEntriesRatio.featuredLabel"),
                  value: round(entriesMetrics.featuredEntriesRatio),
              },
              {
                  key: t("insights.charts.featuredEntriesRatio.otherLabel"),
                  value: round(100 - entriesMetrics.featuredEntriesRatio),
              },
          ]
        : null;

    const completedEntriesRatio = entriesMetrics
        ? [
              {
                  key: t("insights.charts.completedEntriesRatio.completedLabel"),
                  value: round(entriesMetrics.completedEntriesRatio),
              },
              {
                  key: t("insights.charts.completedEntriesRatio.pendingLabel"),
                  value: round(100 - entriesMetrics.completedEntriesRatio),
              },
          ]
        : null;

    return {
        entryLoggingData,
        ...entriesMetrics,
        completedEntriesRatio,
        featuredEntriesRatio,
    };
};
