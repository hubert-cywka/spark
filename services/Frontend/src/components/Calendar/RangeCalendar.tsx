import { CalendarCell, CalendarGrid, Heading, RangeCalendar as AriaRangeCalendar } from "react-aria-components";
import { CalendarDate, parseDate } from "@internationalized/date";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import styles from "./styles/Calendar.module.scss";

import { RangeCalendarProps } from "@/components/Calendar/types/RangeCalendarProps";
import { IconButton } from "@/components/IconButton";
import { formatToISODateString } from "@/features/daily/utils/dateUtils";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

export const RangeCalendar = ({ minDate, maxDate, value, onChange, shownMonths = 1, shownMonthsOffset = 0 }: RangeCalendarProps) => {
    const t = useTranslate();

    const minValue = minDate ? parseDate(minDate) : undefined;
    const maxValue = maxDate ? parseDate(maxDate) : undefined;
    const internalValue = value
        ? {
              start: parseDate(value.from),
              end: parseDate(value.to),
          }
        : undefined;

    const onChangeInternal = (value: { start: CalendarDate; end: CalendarDate } | null) => {
        if (!value) {
            return;
        }

        onChange?.({
            from: formatToISODateString(value.start.toDate("ISO")),
            to: formatToISODateString(value.end.toDate("ISO")),
        });
    };

    return (
        <AriaRangeCalendar
            className={styles.container}
            minValue={minValue}
            maxValue={maxValue}
            value={internalValue}
            onChange={onChangeInternal}
            visibleDuration={{ months: shownMonths }}
        >
            <header className={styles.header}>
                <IconButton
                    slot="previous"
                    iconSlot={ChevronLeftIcon}
                    tooltip={t("common.dateRangePicker.previousRangeButton.label")}
                    aria-label={t("common.dateRangePicker.previousRangeButton.label")}
                />
                <Heading />
                <IconButton
                    slot="next"
                    iconSlot={ChevronRightIcon}
                    tooltip={t("common.dateRangePicker.nextRangeButton.label")}
                    aria-label={t("common.dateRangePicker.nextRangeButton.label")}
                />
            </header>

            <div className={styles.gridWrapper}>
                {Array.from({ length: shownMonths }).map((_, index) => (
                    <CalendarGrid className={styles.grid} key={index} offset={{ months: index + shownMonthsOffset }}>
                        {(date) => <CalendarCell className={styles.cell} date={date} />}
                    </CalendarGrid>
                ))}
            </div>
        </AriaRangeCalendar>
    );
};
