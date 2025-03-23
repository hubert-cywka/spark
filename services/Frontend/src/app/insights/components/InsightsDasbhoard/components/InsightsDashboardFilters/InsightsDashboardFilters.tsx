import { getDateRange } from "./utils/getDateRange";

import styles from "./styles/InsightsDasbhoardFilters.module.scss";

import { Button } from "@/components/Button";
import { DateRangePicker } from "@/components/Input";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { DateRangePreset } from "@/types/DateRangePreset";
import { ISODateStringRange } from "@/types/ISODateString";

type InsightsDashboardFiltersProps = {
    onDateRangeChange: (value: ISODateStringRange) => void;
    dateRange: ISODateStringRange;
};

export const InsightsDashboardFilters = ({ onDateRangeChange, dateRange }: InsightsDashboardFiltersProps) => {
    const t = useTranslate();

    const presets = [
        {
            label: t("insights.filters.presets.pastYear"),
            preset: DateRangePreset.PAST_YEAR,
        },
        {
            label: t("insights.filters.presets.lastYear"),
            preset: DateRangePreset.LAST_YEAR,
        },
        {
            label: t("insights.filters.presets.thisYear"),
            preset: DateRangePreset.THIS_YEAR,
        },
        {
            label: t("insights.filters.presets.pastMonth"),
            preset: DateRangePreset.PAST_MONTH,
        },
        {
            label: t("insights.filters.presets.lastMonth"),
            preset: DateRangePreset.LAST_MONTH,
        },
        {
            label: t("insights.filters.presets.thisMonth"),
            preset: DateRangePreset.THIS_MONTH,
        },
    ];

    // TODO: Use dedicated component (like button group to render presets)
    return (
        <div className={styles.container}>
            <div className={styles.presetsContainer}>
                {presets.map(({ label, preset }) => (
                    <Button
                        key={preset}
                        size="1"
                        variant="secondary"
                        className={styles.preset}
                        onPress={() => onDateRangeChange(getDateRange(preset))}
                    >
                        {label}
                    </Button>
                ))}
            </div>

            <DateRangePicker label={t("insights.filters.dateRange.label")} value={dateRange} onChange={onDateRangeChange} />
        </div>
    );
};
