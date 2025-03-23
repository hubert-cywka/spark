"use client";

import styles from "./styles/InsightsDashboard.module.scss";

import { Card } from "@/components/Card";
import { AreaChart, BarChart, PieChart } from "@/components/Chart";
import { Divider } from "@/components/Divider";
import { StatsCard } from "@/components/StatsCard";
import { useDailyInsights } from "@/features/daily/hooks/useDailyInsights";
import { accumulateEntries, calculateHistogram, distributeEntriesByDayOfWeek } from "@/features/daily/utils/chartUtils";
import { useEntriesInsights } from "@/features/entries/hooks";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { Day } from "@/types/Day";
import { round } from "@/utils/round";

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

export const InsightsDashboard = () => {
    const t = useTranslate();
    // TODO: Dynamic date range
    const { data: dailyInsights } = useDailyInsights({
        from: "2025-01-01",
        to: "2025-03-31",
    });
    const { data: entriesInsights } = useEntriesInsights({
        from: "2025-01-01",
        to: "2025-03-31",
    });

    if (!dailyInsights || !entriesInsights) {
        // TODO: Loading & error state
        return null;
    }

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

    const dailyActivityHistogram = calculateHistogram(dailyInsights.activityHistory);
    const accumulatedEntries = accumulateEntries(dailyInsights.activityHistory);
    const entriesLoggedForDay = distributeEntriesByDayOfWeek(dailyInsights.activityHistory).map(({ key, ...rest }) => {
        return { ...rest, key: translateWeekday(key) };
    });

    const featuredEntriesRatio = [
        {
            key: t("insights.charts.featuredEntriesRatio.featuredLabel"),
            value: round(entriesInsights.featuredEntriesRatio),
        },
        {
            key: t("insights.charts.featuredEntriesRatio.otherLabel"),
            value: round(100 - entriesInsights.featuredEntriesRatio),
        },
    ];

    const completedEntriesRatio = [
        {
            key: t("insights.charts.completedEntriesRatio.completedLabel"),
            value: round(entriesInsights.completedEntriesRatio),
        },
        {
            key: t("insights.charts.completedEntriesRatio.pendingLabel"),
            value: round(100 - entriesInsights.completedEntriesRatio),
        },
    ];

    return (
        <main className={styles.container}>
            <div className={styles.row}>
                <Card className={styles.xl}>
                    <AreaChart
                        height={450}
                        data={accumulatedEntries}
                        xLabel={t("insights.charts.accumulatedEntries.xLabel")}
                        yLabel={t("insights.charts.accumulatedEntries.yLabel")}
                        keyLabel={t("insights.charts.accumulatedEntries.label")}
                        title={t("insights.charts.accumulatedEntries.title")}
                    />
                </Card>
            </div>

            <div className={styles.row}>
                <StatsCard
                    className={styles.xs}
                    title={t("insights.charts.meanActivityPerDay.title")}
                    value={dailyInsights.meanActivityPerDay}
                />
                <StatsCard className={styles.xs} title={t("insights.charts.totalActiveDays.title")} value={dailyInsights.totalActiveDays} />
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

            <Divider />

            <div className={styles.row}>
                <Card className={styles.md}>
                    <PieChart title={t("insights.charts.completedEntriesRatio.title")} withPercentage data={completedEntriesRatio} />
                </Card>

                <Card className={styles.md}>
                    <PieChart title={t("insights.charts.featuredEntriesRatio.title")} withPercentage data={featuredEntriesRatio} />
                </Card>
            </div>

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

            <Divider />

            <div className={styles.row}>
                <Card className={styles.md}>
                    <BarChart
                        data={dailyActivityHistogram}
                        xLabel={t("insights.charts.dailyActivityHistogram.xLabel")}
                        yLabel={t("insights.charts.dailyActivityHistogram.yLabel")}
                        keyLabel={t("insights.charts.dailyActivityHistogram.label")}
                        title={t("insights.charts.dailyActivityHistogram.title")}
                    />
                </Card>

                <Card className={styles.md}>
                    <BarChart
                        data={entriesLoggedForDay}
                        xLabel={t("insights.charts.entriesLoggedForDay.xLabel")}
                        yLabel={t("insights.charts.entriesLoggedForDay.yLabel")}
                        keyLabel={t("insights.charts.entriesLoggedForDay.label")}
                        title={t("insights.charts.entriesLoggedForDay.title")}
                    />
                </Card>
            </div>

            <div className={styles.row}>
                <Card className={styles.xl}>
                    <BarChart
                        data={entryLoggingData}
                        xLabel={t("insights.charts.entryLoggingDistributionGranular.xLabel")}
                        yLabel={t("insights.charts.entryLoggingDistributionGranular.yLabel")}
                        keyLabel={t("insights.charts.entryLoggingDistributionGranular.label")}
                        title={t("insights.charts.entryLoggingDistributionGranular.title")}
                    />
                </Card>
            </div>
        </main>
    );
};
