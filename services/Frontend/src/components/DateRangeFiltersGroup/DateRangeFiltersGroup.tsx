import styles from "./styles/DateRangeFiltersGroup.module.scss";

import { Dropdown } from "@/components/Dropdown/Dropdown.tsx";
import { DateRangePicker } from "@/components/Input";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { DateRangePreset } from "@/types/DateRangePreset";
import { ISODateStringRange } from "@/types/ISODateString";
import { getDateRange, getPresetFromDateRange } from "@/utils/getDateRange.ts";

type DateRangeFiltersGroupProps = {
    onDateRangeChange: (value: ISODateStringRange) => void;
    dateRange: ISODateStringRange;
    size?: "1" | "2" | "3";
};

export const DateRangeFiltersGroup = ({ onDateRangeChange, dateRange, size = "2" }: DateRangeFiltersGroupProps) => {
    const t = useTranslate();
    const selectedPreset = getPresetFromDateRange(dateRange);

    const presets = [
        {
            label: t("common.dateRangePicker.presets.lastYear"),
            key: DateRangePreset.LAST_YEAR,
        },
        {
            label: t("common.dateRangePicker.presets.pastYear"),
            key: DateRangePreset.PAST_YEAR,
        },
        {
            label: t("common.dateRangePicker.presets.thisYear"),
            key: DateRangePreset.THIS_YEAR,
        },

        {
            label: t("common.dateRangePicker.presets.lastMonth"),
            key: DateRangePreset.LAST_MONTH,
        },
        {
            label: t("common.dateRangePicker.presets.pastMonth"),
            key: DateRangePreset.PAST_MONTH,
        },
        {
            label: t("common.dateRangePicker.presets.thisMonth"),
            key: DateRangePreset.THIS_MONTH,
        },
    ];

    return (
        <div className={styles.container}>
            <Dropdown
                placeholder={t("common.dateRangePicker.presets.placeholder")}
                label={t("common.dateRangePicker.presets.label")}
                selectedKey={selectedPreset}
                onChange={(preset) => onDateRangeChange(getDateRange(preset))}
                items={presets}
                size={size}
            />
            <DateRangePicker size={size} label={t("common.dateRangePicker.label")} value={dateRange} onChange={onDateRangeChange} />
        </div>
    );
};
