import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

export const useDailyActivityChartLabels = () => {
    const t = useTranslate();

    return {
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
};
