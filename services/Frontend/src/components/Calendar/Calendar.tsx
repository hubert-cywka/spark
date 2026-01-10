import { Calendar as AriaCalendar, CalendarCell, CalendarGrid, Heading } from "react-aria-components";
import { CalendarDate, parseDate } from "@internationalized/date";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import styles from "./styles/Calendar.module.scss";

import { CalendarProps } from "@/components/Calendar/types/Calendar";
import { IconButton } from "@/components/IconButton";
import { formatToISODateString } from "@/features/daily/utils/dateUtils";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

export const Calendar = ({ minDate, maxDate, value, onChange, shownMonths = 1, shownMonthsOffset = 0 }: CalendarProps) => {
    const t = useTranslate();

    const minValue = minDate ? parseDate(minDate) : undefined;
    const maxValue = maxDate ? parseDate(maxDate) : undefined;
    const internalValue = value ? parseDate(value) : undefined;

    const onChangeInternal = (date: CalendarDate) => {
        if (!date) {
            return;
        }

        onChange?.(formatToISODateString(date.toDate("ISO")));
    };

    return (
        <AriaCalendar
            className={styles.container}
            minValue={minValue}
            maxValue={maxValue}
            value={internalValue}
            onChange={onChangeInternal}
        >
            <header className={styles.header}>
                <IconButton
                    slot="previous"
                    iconSlot={ChevronLeftIcon}
                    tooltip={t("common.datePicker.previousRangeButton.label")}
                    aria-label={t("common.datePicker.previousRangeButton.label")}
                />
                <Heading />
                <IconButton
                    slot="next"
                    iconSlot={ChevronRightIcon}
                    tooltip={t("common.datePicker.nextRangeButton.label")}
                    aria-label={t("common.datePicker.nextRangeButton.label")}
                />
            </header>

            <div className={styles.gridWrapper}>
                {Array.from({ length: shownMonths }).map((_, index) => (
                    <CalendarGrid className={styles.grid} key={index} offset={{ months: index + shownMonthsOffset }}>
                        {(date) => <CalendarCell className={styles.cell} date={date} />}
                    </CalendarGrid>
                ))}
            </div>
        </AriaCalendar>
    );
};
