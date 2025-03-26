import { getDateRange, getPresetFromDateRange } from "./utils/getDateRange";

import styles from "./styles/InsightsDasbhoardFilters.module.scss";

import { DateRangePicker } from "@/components/Input";
import { ToggleButton } from "@/components/ToggleButton";
import { ToggleButtonGroup } from "@/components/ToggleButtonGroup";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { DateRangePreset } from "@/types/DateRangePreset";
import { ISODateStringRange } from "@/types/ISODateString";

type InsightsDashboardFiltersProps = {
    onDateRangeChange: (value: ISODateStringRange) => void;
    dateRange: ISODateStringRange;
};

export const InsightsDashboardFilters = ({ onDateRangeChange, dateRange }: InsightsDashboardFiltersProps) => {
    const t = useTranslate();
    const selectedPreset = getPresetFromDateRange(dateRange);

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

    return (
        <div className={styles.container}>
            <ToggleButtonGroup className={styles.presetsContainer} selectedKeys={selectedPreset ? [selectedPreset] : []}>
                {presets.map(({ label, preset }) => (
                    <ToggleButton
                        size="1"
                        id={preset}
                        key={preset}
                        className={styles.preset}
                        onPress={() => onDateRangeChange(getDateRange(preset))}
                    >
                        {label}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>

            <DateRangePicker label={t("insights.filters.dateRange.label")} value={dateRange} onChange={onDateRangeChange} />
        </div>
    );
};
