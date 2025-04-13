import { useEntriesMetrics, useEntryLoggingHistogram } from "@/features/entries/hooks";
import { useTranslateWeekday } from "@/hooks/useTranslateWeekday.ts";
import { ISODateStringRange } from "@/types/ISODateString";

type UseEntryMetricsOptions = {
    dateRange: ISODateStringRange;
};

export const useProcessedEntryMetrics = ({ dateRange }: UseEntryMetricsOptions) => {
    const translateWeekday = useTranslateWeekday();

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

    return {
        entryLoggingData,
        ...entriesMetrics,
    };
};
