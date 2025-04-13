"use client";

import { useState } from "react";
import classNames from "clsx";

import { ChartContainer } from "./components/ChartContainer";
import { InsightsDashboardFilters } from "./components/InsightsDashboardFilters";

import styles from "./styles/InsightsDashboard.module.scss";

import { AreaChart, BarChart, RadialChart } from "@/components/Chart";
import { Divider } from "@/components/Divider";
import { StatsCard } from "@/components/StatsCard";
import { StatsCardSkeleton } from "@/components/StatsCard/StatsCardSkeleton";
import { KeyInsightsSummary } from "@/features/insights/components/KeyInsightsSummary";
import { useProcessedDailyMetrics, useProcessedEntryMetrics, useRateMetrics } from "@/features/insights/hooks";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { DateRangePreset } from "@/types/DateRangePreset";
import { ISODateString } from "@/types/ISODateString";
import { getColorFromPercentageBasedScore } from "@/utils/colorUtils.ts";
import { getDateRange } from "@/utils/getDateRange.ts";

const STATS_CARD_HEIGHT = 130;
const BAR_CHART_HEIGHT = 400;
const AREA_CHART_HEIGHT = 450;
const PIE_CHART_HEIGHT = 400;

const SCORE_CHART_HEIGHT = 300;
const SUMMARY_SKELETON_HEIGHT = SCORE_CHART_HEIGHT + 50;
const SCORE_CHART_RADIUS = 175;
const SCORE_CHART_WIDTH = 15;

export const InsightsDashboard = () => {
    const t = useTranslate();

    // TODO: Save date range setting
    const [dateRange, setDateRange] = useState<{
        from: ISODateString;
        to: ISODateString;
    }>(getDateRange(DateRangePreset.PAST_MONTH));

    const dailyMetrics = useProcessedDailyMetrics({ dateRange });
    const entryMetrics = useProcessedEntryMetrics({ dateRange });

    const {
        score,
        insights,
        ready: areInsightsReady,
    } = useRateMetrics({
        enabled: !!entryMetrics && !!dailyMetrics,
        data: {
            activeDayRate: dailyMetrics?.activeDayRate ?? 0,
            totalEntriesAmount: entryMetrics?.totalEntriesAmount ?? 0,
            featuredEntriesRatio: entryMetrics?.featuredEntriesRatio ?? 0,
            completedEntriesRatio: entryMetrics?.completedEntriesRatio ?? 0,
            currentDailyStreak: dailyMetrics ? dailyMetrics.currentActivityStreak : null,
        },
    });

    return (
        <main className={styles.container}>
            <InsightsDashboardFilters onDateRangeChange={setDateRange} dateRange={dateRange} />

            <Divider>{t("insights.separators.summary")}</Divider>

            <div className={styles.row}>
                <ChartContainer className={styles.sm} isLoading={!areInsightsReady} height={SCORE_CHART_HEIGHT}>
                    <RadialChart
                        title={t("insights.summary.score.title")}
                        description={t("insights.summary.score.description")}
                        data={insights.length ? score : null}
                        width={SCORE_CHART_WIDTH}
                        outerRadius={SCORE_CHART_RADIUS}
                        activeColor={getColorFromPercentageBasedScore(score)}
                    />
                </ChartContainer>

                {areInsightsReady ? (
                    <KeyInsightsSummary insights={insights} className={styles.lg} />
                ) : (
                    <StatsCardSkeleton height={SUMMARY_SKELETON_HEIGHT} className={styles.lg} />
                )}
            </div>

            <Divider>{t("insights.separators.activity")}</Divider>

            <div className={styles.row}>
                <ChartContainer className={styles.xl} isLoading={!dailyMetrics} height={AREA_CHART_HEIGHT}>
                    <AreaChart
                        height={AREA_CHART_HEIGHT}
                        data={dailyMetrics?.entriesAccumulatedByDays ?? []}
                        xLabel={t("insights.charts.entriesAccumulatedByDays.xLabel")}
                        yLabel={t("insights.charts.entriesAccumulatedByDays.yLabel")}
                        keyLabel={t("insights.charts.entriesAccumulatedByDays.label")}
                        title={t("insights.charts.entriesAccumulatedByDays.title")}
                        description={t("insights.charts.entriesAccumulatedByDays.description")}
                    />
                </ChartContainer>
            </div>

            {dailyMetrics ? (
                <div className={styles.row}>
                    <ChartContainer className={styles.md} isLoading={!dailyMetrics} height={PIE_CHART_HEIGHT}>
                        <RadialChart
                            title={t("insights.charts.activeDayRate.title")}
                            description={t("insights.charts.activeDayRate.description")}
                            data={dailyMetrics?.activeDayRate ?? 0}
                        />
                    </ChartContainer>

                    <div className={classNames(styles.column, styles.xs)}>
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
                    </div>

                    <div className={classNames(styles.column, styles.xs)}>
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
                </div>
            ) : (
                <div className={styles.row}>
                    <StatsCardSkeleton height={STATS_CARD_HEIGHT} className={styles.xs} />
                    <StatsCardSkeleton height={STATS_CARD_HEIGHT} className={styles.xs} />
                    <StatsCardSkeleton height={STATS_CARD_HEIGHT} className={styles.xs} />
                    <StatsCardSkeleton height={STATS_CARD_HEIGHT} className={styles.xs} />
                </div>
            )}

            <Divider>{t("insights.separators.entries")}</Divider>

            <div className={styles.row}>
                <ChartContainer className={styles.md} isLoading={!entryMetrics} height={PIE_CHART_HEIGHT}>
                    <RadialChart
                        title={t("insights.charts.completedEntriesRatio.title")}
                        description={t("insights.charts.completedEntriesRatio.description")}
                        data={entryMetrics?.completedEntriesRatio ?? 0}
                    />
                </ChartContainer>

                <ChartContainer className={styles.md} isLoading={!entryMetrics} height={PIE_CHART_HEIGHT}>
                    <RadialChart
                        title={t("insights.charts.featuredEntriesRatio.title")}
                        description={t("insights.charts.featuredEntriesRatio.description")}
                        data={entryMetrics?.featuredEntriesRatio ?? 0}
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

            <Divider>{t("insights.separators.habits")}</Divider>

            <div className={styles.row}>
                <ChartContainer className={styles.md} isLoading={!dailyMetrics} height={BAR_CHART_HEIGHT}>
                    <BarChart
                        data={dailyMetrics?.dailyActivityHistogram ?? []}
                        xLabel={t("insights.charts.dailyActivityHistogram.xLabel")}
                        yLabel={t("insights.charts.dailyActivityHistogram.yLabel")}
                        keyLabel={t("insights.charts.dailyActivityHistogram.label")}
                        title={t("insights.charts.dailyActivityHistogram.title")}
                        description={t("insights.charts.dailyActivityHistogram.description")}
                    />
                </ChartContainer>

                <ChartContainer className={styles.md} isLoading={!dailyMetrics} height={BAR_CHART_HEIGHT}>
                    <BarChart
                        data={dailyMetrics?.entriesLoggedForDay ?? []}
                        xLabel={t("insights.charts.entriesLoggedForDay.xLabel")}
                        yLabel={t("insights.charts.entriesLoggedForDay.yLabel")}
                        keyLabel={t("insights.charts.entriesLoggedForDay.label")}
                        title={t("insights.charts.entriesLoggedForDay.title")}
                        description={t("insights.charts.entriesLoggedForDay.description")}
                    />
                </ChartContainer>
            </div>

            <div className={styles.row}>
                <ChartContainer className={styles.xl} isLoading={!entryMetrics} height={BAR_CHART_HEIGHT}>
                    <BarChart
                        data={entryMetrics?.entryLoggingData ?? []}
                        xLabel={t("insights.charts.entryLoggingDistributionGranular.xLabel")}
                        yLabel={t("insights.charts.entryLoggingDistributionGranular.yLabel")}
                        keyLabel={t("insights.charts.entryLoggingDistributionGranular.label")}
                        title={t("insights.charts.entryLoggingDistributionGranular.title")}
                        description={t("insights.charts.entryLoggingDistributionGranular.description")}
                    />
                </ChartContainer>
            </div>
        </main>
    );
};
