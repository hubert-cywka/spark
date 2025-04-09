"use client";

import { useState } from "react";

import { ChartContainer } from "./components/ChartContainer";
import { InsightsDashboardFilters } from "./components/InsightsDashboardFilters";
import { useProcessedDailyMetrics } from "./hooks/useProcessedDailyMetrics.ts";
import { useProcessedEntryMetrics } from "./hooks/useProcessedEntryMetrics.ts";

import styles from "./styles/InsightsDashboard.module.scss";

import { AreaChart, BarChart, PieChart } from "@/components/Chart";
import { Divider } from "@/components/Divider";
import { StatsCard } from "@/components/StatsCard";
import { StatsCardSkeleton } from "@/components/StatsCard/StatsCardSkeleton";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { DateRangePreset } from "@/types/DateRangePreset";
import { ISODateString } from "@/types/ISODateString";
import { getDateRange } from "@/utils/getDateRange.ts";

const STATS_CARD_HEIGHT = 130;
const BAR_CHART_HEIGHT = 400;
const AREA_CHART_HEIGHT = 450;
const PIE_CHART_HEIGHT = 400;

export const InsightsDashboard = () => {
    const t = useTranslate();

    // TODO: Save date range setting
    const [dateRange, setDateRange] = useState<{
        from: ISODateString;
        to: ISODateString;
    }>(getDateRange(DateRangePreset.THIS_YEAR));

    const dailyMetrics = useProcessedDailyMetrics({ dateRange });
    const entryMetrics = useProcessedEntryMetrics({ dateRange });

    return (
        <main className={styles.container}>
            <InsightsDashboardFilters onDateRangeChange={setDateRange} dateRange={dateRange} />

            <Divider />

            <div className={styles.row}>
                <ChartContainer className={styles.xl} isLoading={!dailyMetrics?.entriesAccumulatedByDays} height={AREA_CHART_HEIGHT}>
                    <AreaChart
                        height={AREA_CHART_HEIGHT}
                        data={dailyMetrics?.entriesAccumulatedByDays ?? []}
                        xLabel={t("insights.charts.entriesAccumulatedByDays.xLabel")}
                        yLabel={t("insights.charts.entriesAccumulatedByDays.yLabel")}
                        keyLabel={t("insights.charts.entriesAccumulatedByDays.label")}
                        title={t("insights.charts.entriesAccumulatedByDays.title")}
                    />
                </ChartContainer>
            </div>

            {dailyMetrics ? (
                <div className={styles.row}>
                    <StatsCard
                        className={styles.xs}
                        title={t("insights.charts.meanActivityPerDay.title")}
                        description={t("insights.charts.meanActivityPerDay.description")}
                        value={dailyMetrics.meanActivityPerDay}
                    />
                    <StatsCard
                        className={styles.xs}
                        title={t("insights.charts.totalActiveDays.title")}
                        description={t("insights.charts.totalActiveDays.description")}
                        value={dailyMetrics.totalActiveDays}
                    />
                    <StatsCard
                        className={styles.xs}
                        title={t("insights.charts.currentStreak.title")}
                        description={t("insights.charts.currentStreak.description")}
                        value={dailyMetrics.currentActivityStreak}
                    />
                    <StatsCard
                        className={styles.xs}
                        title={t("insights.charts.longestStreak.title")}
                        description={t("insights.charts.longestStreak.description")}
                        value={dailyMetrics.longestActivityStreak}
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
                <ChartContainer className={styles.md} isLoading={!entryMetrics?.completedEntriesRatio} height={PIE_CHART_HEIGHT}>
                    <PieChart
                        title={t("insights.charts.completedEntriesRatio.title")}
                        withPercentage
                        data={entryMetrics?.completedEntriesRatio ?? []}
                    />
                </ChartContainer>

                <ChartContainer className={styles.md} isLoading={!entryMetrics?.featuredEntriesRatio} height={PIE_CHART_HEIGHT}>
                    <PieChart
                        title={t("insights.charts.featuredEntriesRatio.title")}
                        withPercentage
                        data={entryMetrics?.featuredEntriesRatio ?? []}
                    />
                </ChartContainer>
            </div>

            {entryMetrics ? (
                <div className={styles.row}>
                    <StatsCard
                        className={styles.xs}
                        title={t("insights.charts.pendingEntriesAmount.title")}
                        description={t("insights.charts.pendingEntriesAmount.description")}
                        value={entryMetrics.pendingEntriesAmount}
                    />
                    <StatsCard
                        className={styles.xs}
                        title={t("insights.charts.completedEntriesAmount.title")}
                        description={t("insights.charts.completedEntriesAmount.description")}
                        value={entryMetrics.completedEntriesAmount}
                    />
                    <StatsCard
                        className={styles.xs}
                        title={t("insights.charts.featuredEntriesAmount.title")}
                        description={t("insights.charts.featuredEntriesAmount.description")}
                        value={entryMetrics.featuredEntriesAmount}
                    />
                    <StatsCard
                        className={styles.xs}
                        title={t("insights.charts.totalEntriesAmount.title")}
                        description={t("insights.charts.totalEntriesAmount.description")}
                        value={entryMetrics.totalEntriesAmount}
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
                <ChartContainer className={styles.md} isLoading={!dailyMetrics?.dailyActivityHistogram} height={BAR_CHART_HEIGHT}>
                    <BarChart
                        data={dailyMetrics?.dailyActivityHistogram ?? []}
                        xLabel={t("insights.charts.dailyActivityHistogram.xLabel")}
                        yLabel={t("insights.charts.dailyActivityHistogram.yLabel")}
                        keyLabel={t("insights.charts.dailyActivityHistogram.label")}
                        title={t("insights.charts.dailyActivityHistogram.title")}
                    />
                </ChartContainer>

                <ChartContainer className={styles.md} isLoading={!dailyMetrics?.entriesLoggedForDay} height={BAR_CHART_HEIGHT}>
                    <BarChart
                        data={dailyMetrics?.entriesLoggedForDay ?? []}
                        xLabel={t("insights.charts.entriesLoggedForDay.xLabel")}
                        yLabel={t("insights.charts.entriesLoggedForDay.yLabel")}
                        keyLabel={t("insights.charts.entriesLoggedForDay.label")}
                        title={t("insights.charts.entriesLoggedForDay.title")}
                    />
                </ChartContainer>
            </div>

            <div className={styles.row}>
                <ChartContainer className={styles.xl} isLoading={!entryMetrics?.entryLoggingData} height={BAR_CHART_HEIGHT}>
                    <BarChart
                        data={entryMetrics?.entryLoggingData ?? []}
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
