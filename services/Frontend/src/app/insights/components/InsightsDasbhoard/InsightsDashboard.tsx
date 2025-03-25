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
import { useEntriesMetrics, useEntryLoggingHistogram } from "@/features/entries/hooks";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { DateRangePreset } from "@/types/DateRangePreset";
import { Day } from "@/types/Day";
import { ISODateString } from "@/types/ISODateString";
import { round } from "@/utils/round";

const STATS_CARD_HEIGHT = 130;
const BAR_CHART_HEIGHT = 400;
const AREA_CHART_HEIGHT = 450;
const PIE_CHART_HEIGHT = 400;

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

    const { data: entriesMetrics } = useEntriesMetrics({
        from: dateRange.from,
        to: dateRange.to,
    });

    const { data: histogram } = useEntryLoggingHistogram({
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

    const entryLoggingData = !histogram
        ? null
        : histogram.days.flatMap((day) =>
              day.hours.flatMap(({ hour, count }) => ({
                  key: `${translateWeekday(day.dayOfWeek)}, ${hour}-${hour + 1}`,
                  value: count,
              }))
          );

    const dailyActivityHistogram = dailyInsights ? calculateHistogram(dailyInsights.activityHistory) : null;
    const accumulatedEntries = dailyInsights ? accumulateEntries(dailyInsights.activityHistory) : null;
    const entriesLoggedForDay = dailyInsights
        ? distributeEntriesByDayOfWeek(dailyInsights.activityHistory).map(({ key, ...rest }) => {
              return { ...rest, key: translateWeekday(key) };
          })
        : null;

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

            {entriesMetrics ? (
                <div className={styles.row}>
                    <StatsCard
                        className={styles.xs}
                        title={t("insights.charts.pendingEntriesAmount.title")}
                        value={entriesMetrics.pendingEntriesAmount}
                    />
                    <StatsCard
                        className={styles.xs}
                        title={t("insights.charts.completedEntriesAmount.title")}
                        value={entriesMetrics.completedEntriesAmount}
                    />
                    <StatsCard
                        className={styles.xs}
                        title={t("insights.charts.featuredEntriesAmount.title")}
                        value={entriesMetrics.featuredEntriesAmount}
                    />
                    <StatsCard
                        className={styles.xs}
                        title={t("insights.charts.totalEntriesAmount.title")}
                        value={entriesMetrics.totalEntriesAmount}
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
