import { cloneElement } from "react";
import ActivityCalendar from "react-activity-calendar";
import { Tooltip } from "react-tooltip";

import styles from "./styles/DailyActivityChart.module.scss";
import "react-tooltip/dist/react-tooltip.css";

import { DailyActivity } from "@/features/daily/types/Daily";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

const TOOLTIP_ID = "daily-activity-block-tooltip";

type DailyActivityChartProps = {
    activity: DailyActivity[];
    onSelectDay: (date: string) => void;
    isLoading?: boolean;
};

export const DailyActivityChart = ({ activity, onSelectDay, isLoading }: DailyActivityChartProps) => {
    const t = useTranslate();

    const maxActivity = Math.max(1, ...activity.map(({ entriesCount }) => entriesCount));
    const chartData = activity.map(({ date, entriesCount }) => ({
        date,
        count: entriesCount,
        level: entriesCount,
    }));

    const labels = {
        months: [
            t("daily.activity.chart.months.jan"),
            t("daily.activity.chart.months.feb"),
            t("daily.activity.chart.months.mar"),
            t("daily.activity.chart.months.apr"),
            t("daily.activity.chart.months.may"),
            t("daily.activity.chart.months.jun"),
            t("daily.activity.chart.months.jul"),
            t("daily.activity.chart.months.aug"),
            t("daily.activity.chart.months.sep"),
            t("daily.activity.chart.months.oct"),
            t("daily.activity.chart.months.nov"),
            t("daily.activity.chart.months.dec"),
        ],
        legend: {
            less: t("daily.activity.chart.legend.less"),
            more: t("daily.activity.chart.legend.more"),
        },
    };

    return (
        <div className={styles.container}>
            <ActivityCalendar
                hideTotalCount
                hideColorLegend
                loading={isLoading}
                maxLevel={maxActivity}
                blockSize={16}
                eventHandlers={{
                    onClick: (_event) => (activity) => onSelectDay(activity.date),
                }}
                renderBlock={(block, activity) =>
                    cloneElement(block, {
                        "data-tooltip-id": TOOLTIP_ID,
                        "data-tooltip-html": t("daily.activity.chart.tooltip", {
                            count: activity.count,
                            date: activity.date,
                        }),
                        className: styles.activityBlock,
                    })
                }
                labels={labels}
                data={chartData}
                colorScheme="dark"
                theme={{ dark: ["#22222288", "#5500FF"] }}
            />
            <Tooltip id={TOOLTIP_ID} />
        </div>
    );
};
