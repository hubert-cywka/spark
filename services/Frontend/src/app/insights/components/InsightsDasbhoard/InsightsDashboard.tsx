"use client";

import { useState } from "react";

import { ChartContainer } from "./components/ChartContainer";
import { InsightsDashboardFilters } from "./components/InsightsDashboardFilters";

import styles from "./styles/InsightsDashboard.module.scss";

import { getDateRange } from "@/app/insights/components/InsightsDasbhoard/components/InsightsDashboardFilters/utils/getDateRange";
import { AreaChart, BarChart, PieChart } from "@/components/Chart";
import { Divider } from "@/components/Divider";
import { StatsCard } from "@/components/StatsCard";
import { StatsCardSkeleton } from "@/components/StatsCard/StatsCardSkeleton";
import { useDailyInsights } from "@/features/daily/hooks/useDailyInsights";
import { accumulateEntries, calculateHistogram, distributeEntriesByDayOfWeek } from "@/features/daily/utils/chartUtils";
import { useEntriesInsights } from "@/features/entries/hooks";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { DateRangePreset } from "@/types/DateRangePreset";
import { Day } from "@/types/Day";
import { ISODateString } from "@/types/ISODateString";
import { round } from "@/utils/round";

const STATS_CARD_HEIGHT = 130;
const BAR_CHART_HEIGHT = 400;
const AREA_CHART_HEIGHT = 450;
const PIE_CHART_HEIGHT = 400;

// TODO: Do not use mock data
const entryLoggingData = [
    { key: "Mon 0-2", value: 0 },
    { key: "Mon 2-4", value: 0 },
    { key: "Mon 4-6", value: 0 },
    { key: "Mon 8-10", value: 0 },
    { key: "Mon 10-12", value: 0 },
    { key: "Mon 12-14", value: 0 },
    { key: "Mon 14-16", value: 0 },
    { key: "Mon 16-18", value: 0 },
    { key: "Mon 18-20", value: 0 },
    { key: "Mon 20-22", value: 0 },
    { key: "Mon 22-24", value: 0 },
    { key: "Tue 0-2", value: 0 },
    { key: "Tue 2-4", value: 0 },
    { key: "Tue 4-6", value: 0 },
    { key: "Tue 8-10", value: 2 },
    { key: "Tue 10-12", value: 0 },
    { key: "Tue 12-14", value: 0 },
    { key: "Tue 14-16", value: 2 },
    { key: "Tue 16-18", value: 0 },
    { key: "Tue 18-20", value: 0 },
    { key: "Tue 20-22", value: 0 },
    { key: "Tue 22-24", value: 0 },
    { key: "Wed 0-2", value: 0 },
    { key: "Wed 2-4", value: 0 },
    { key: "Wed 4-6", value: 0 },
    { key: "Wed 8-10", value: 3 },
    { key: "Wed 10-12", value: 1 },
    { key: "Wed 12-14", value: 1 },
    { key: "Wed 14-16", value: 2 },
    { key: "Wed 16-18", value: 3 },
    { key: "Wed 18-20", value: 0 },
    { key: "Wed 20-22", value: 0 },
    { key: "Wed 22-24", value: 0 },
    { key: "Thu 0-2", value: 0 },
    { key: "Thu 2-4", value: 0 },
    { key: "Thu 4-6", value: 0 },
    { key: "Thu 8-10", value: 4 },
    { key: "Thu 10-12", value: 1 },
    { key: "Thu 12-14", value: 0 },
    { key: "Thu 14-16", value: 1 },
    { key: "Thu 16-18", value: 4 },
    { key: "Thu 18-20", value: 1 },
    { key: "Thu 20-22", value: 0 },
    { key: "Thu 22-24", value: 0 },
    { key: "Fri 0-2", value: 0 },
    { key: "Fri 2-4", value: 0 },
    { key: "Fri 4-6", value: 0 },
    { key: "Fri 8-10", value: 2 },
    { key: "Fri 10-12", value: 1 },
    { key: "Fri 12-14", value: 0 },
    { key: "Fri 14-16", value: 0 },
    { key: "Fri 16-18", value: 9 },
    { key: "Fri 18-20", value: 3 },
    { key: "Fri 20-22", value: 0 },
    { key: "Fri 22-24", value: 0 },
    { key: "Sat 0-2", value: 0 },
    { key: "Sat 2-4", value: 0 },
    { key: "Sat 4-6", value: 0 },
    { key: "Sat 8-10", value: 0 },
    { key: "Sat 10-12", value: 0 },
    { key: "Sat 12-14", value: 0 },
    { key: "Sat 14-16", value: 0 },
    { key: "Sat 16-18", value: 3 },
    { key: "Sat 18-20", value: 12 },
    { key: "Sat 20-22", value: 0 },
    { key: "Sat 22-24", value: 0 },
    { key: "Sun 0-2", value: 0 },
    { key: "Sun 2-4", value: 0 },
    { key: "Sun 4-6", value: 0 },
    { key: "Sun 8-10", value: 0 },
    { key: "Sun 10-12", value: 0 },
    { key: "Sun 12-14", value: 0 },
    { key: "Sun 14-16", value: 0 },
    { key: "Sun 16-18", value: 0 },
    { key: "Sun 18-20", value: 0 },
    { key: "Sun 20-22", value: 0 },
    { key: "Sun 22-24", value: 0 },
];

// TODO: Clean up
export const InsightsDashboard = () => {
    const t = useTranslate();

    // TODO: Save date range setting
    const [dateRange, setDateRange] = useState<{
        from: ISODateString;
        to: ISODateString;
    }>(getDateRange(DateRangePreset.THIS_YEAR));

    const { data: dailyInsights } = useDailyInsights({
        from: dateRange.from,
        to: dateRange.to,
    });

    const { data: entriesInsights } = useEntriesInsights({
        from: dateRange.from,
        to: dateRange.to,
    });

    const translateWeekday = (day: Day) => {
        switch (day) {
            case Day.SUNDAY:
                return t("common.day.sunday");
            case Day.MONDAY:
                return t("common.day.monday");
            case Day.TUESDAY:
                return t("common.day.tuesday");
            case Day.WEDNESDAY:
                return t("common.day.wednesday");
            case Day.THURSDAY:
                return t("common.day.thursday");
            case Day.FRIDAY:
                return t("common.day.friday");
            case Day.SATURDAY:
                return t("common.day.saturday");
        }
    };

    const dailyActivityHistogram = dailyInsights ? calculateHistogram(dailyInsights.activityHistory) : null;
    const accumulatedEntries = dailyInsights ? accumulateEntries(dailyInsights.activityHistory) : null;
    const entriesLoggedForDay = dailyInsights
        ? distributeEntriesByDayOfWeek(dailyInsights.activityHistory).map(({ key, ...rest }) => {
              return { ...rest, key: translateWeekday(key) };
          })
        : null;

    const featuredEntriesRatio = entriesInsights
        ? [
              {
                  key: t("insights.charts.featuredEntriesRatio.featuredLabel"),
                  value: round(entriesInsights.featuredEntriesRatio),
              },
              {
                  key: t("insights.charts.featuredEntriesRatio.otherLabel"),
                  value: round(100 - entriesInsights.featuredEntriesRatio),
              },
          ]
        : null;

    const completedEntriesRatio = entriesInsights
        ? [
              {
                  key: t("insights.charts.completedEntriesRatio.completedLabel"),
                  value: round(entriesInsights.completedEntriesRatio),
              },
              {
                  key: t("insights.charts.completedEntriesRatio.pendingLabel"),
                  value: round(100 - entriesInsights.completedEntriesRatio),
              },
          ]
        : null;

    return (
        <main className={styles.container}>
            <InsightsDashboardFilters onDateRangeChange={setDateRange} dateRange={dateRange} />

            <Divider />

            <div className={styles.row}>
                <ChartContainer className={styles.xl} isLoading={!accumulatedEntries} height={AREA_CHART_HEIGHT}>
                    <AreaChart
                        height={AREA_CHART_HEIGHT}
                        data={accumulatedEntries ?? []}
                        xLabel={t("insights.charts.accumulatedEntries.xLabel")}
                        yLabel={t("insights.charts.accumulatedEntries.yLabel")}
                        keyLabel={t("insights.charts.accumulatedEntries.label")}
                        title={t("insights.charts.accumulatedEntries.title")}
                    />
                </ChartContainer>
            </div>

            {dailyInsights ? (
                <div className={styles.row}>
                    <StatsCard
                        className={styles.xs}
                        title={t("insights.charts.meanActivityPerDay.title")}
                        value={dailyInsights.meanActivityPerDay}
                    />
                    <StatsCard
                        className={styles.xs}
                        title={t("insights.charts.totalActiveDays.title")}
                        value={dailyInsights.totalActiveDays}
                    />
                    <StatsCard
                        className={styles.xs}
                        title={t("insights.charts.currentStreak.title")}
                        value={dailyInsights.currentActivityStreak}
                    />
                    <StatsCard
                        className={styles.xs}
                        title={t("insights.charts.longestStreak.title")}
                        value={dailyInsights.longestActivityStreak}
                    />
                </div>
            ) : (
                <div className={styles.row}>
                    <StatsCardSkeleton height={STATS_CARD_HEIGHT} className={styles.xs} />
                    <StatsCardSkeleton height={STATS_CARD_HEIGHT} className={styles.xs} />
                    <StatsCardSkeleton height={STATS_CARD_HEIGHT} className={styles.xs} />
                    <StatsCardSkeleton height={STATS_CARD_HEIGHT} className={styles.xs} />
                </div>
            )}

            <Divider />

            <div className={styles.row}>
                <ChartContainer className={styles.md} isLoading={!completedEntriesRatio} height={PIE_CHART_HEIGHT}>
                    <PieChart title={t("insights.charts.completedEntriesRatio.title")} withPercentage data={completedEntriesRatio ?? []} />
                </ChartContainer>

                <ChartContainer className={styles.md} isLoading={!featuredEntriesRatio} height={PIE_CHART_HEIGHT}>
                    <PieChart title={t("insights.charts.featuredEntriesRatio.title")} withPercentage data={featuredEntriesRatio ?? []} />
                </ChartContainer>
            </div>

            {entriesInsights ? (
                <div className={styles.row}>
                    <StatsCard
                        className={styles.xs}
                        title={t("insights.charts.pendingEntriesAmount.title")}
                        value={entriesInsights.pendingEntriesAmount}
                    />
                    <StatsCard
                        className={styles.xs}
                        title={t("insights.charts.completedEntriesAmount.title")}
                        value={entriesInsights.completedEntriesAmount}
                    />
                    <StatsCard
                        className={styles.xs}
                        title={t("insights.charts.featuredEntriesAmount.title")}
                        value={entriesInsights.featuredEntriesAmount}
                    />
                    <StatsCard
                        className={styles.xs}
                        title={t("insights.charts.totalEntriesAmount.title")}
                        value={entriesInsights.totalEntriesAmount}
                    />
                </div>
            ) : (
                <div className={styles.row}>
                    <StatsCardSkeleton height={STATS_CARD_HEIGHT} className={styles.xs} />
                    <StatsCardSkeleton height={STATS_CARD_HEIGHT} className={styles.xs} />
                    <StatsCardSkeleton height={STATS_CARD_HEIGHT} className={styles.xs} />
                    <StatsCardSkeleton height={STATS_CARD_HEIGHT} className={styles.xs} />
                </div>
            )}

            <Divider />

            <div className={styles.row}>
                <ChartContainer className={styles.md} isLoading={!dailyActivityHistogram} height={BAR_CHART_HEIGHT}>
                    <BarChart
                        data={dailyActivityHistogram ?? []}
                        xLabel={t("insights.charts.dailyActivityHistogram.xLabel")}
                        yLabel={t("insights.charts.dailyActivityHistogram.yLabel")}
                        keyLabel={t("insights.charts.dailyActivityHistogram.label")}
                        title={t("insights.charts.dailyActivityHistogram.title")}
                    />
                </ChartContainer>

                <ChartContainer className={styles.md} isLoading={!entriesLoggedForDay} height={BAR_CHART_HEIGHT}>
                    <BarChart
                        data={entriesLoggedForDay ?? []}
                        xLabel={t("insights.charts.entriesLoggedForDay.xLabel")}
                        yLabel={t("insights.charts.entriesLoggedForDay.yLabel")}
                        keyLabel={t("insights.charts.entriesLoggedForDay.label")}
                        title={t("insights.charts.entriesLoggedForDay.title")}
                    />
                </ChartContainer>
            </div>

            <div className={styles.row}>
                <ChartContainer className={styles.xl} isLoading={!entryLoggingData} height={BAR_CHART_HEIGHT}>
                    <BarChart
                        data={entryLoggingData ?? []}
                        xLabel={t("insights.charts.entryLoggingDistributionGranular.xLabel")}
                        yLabel={t("insights.charts.entryLoggingDistributionGranular.yLabel")}
                        keyLabel={t("insights.charts.entryLoggingDistributionGranular.label")}
                        title={t("insights.charts.entryLoggingDistributionGranular.title")}
                    />
                </ChartContainer>
            </div>
        </main>
    );
};
