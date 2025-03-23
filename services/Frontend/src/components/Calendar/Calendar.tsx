import { CalendarCell, CalendarGrid, Heading, RangeCalendar } from "react-aria-components";
import { CalendarDate, parseDate } from "@internationalized/date";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import styles from "./styles/Calendar.module.scss";

import { CalendarProps } from "@/components/Calendar/types/Calendar";
import { IconButton } from "@/components/IconButton";
import { formatToISODateString } from "@/features/daily/utils/dateUtils";

export const Calendar = ({ minDate, maxDate, value, onChange, shownMonths = 1, shownMonthsOffset = 0 }: CalendarProps) => {
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
        <RangeCalendar
            className={styles.container}
            aria-label="Appointment date"
            minValue={minValue}
            maxValue={maxValue}
            value={internalValue}
            onChange={onChangeInternal}
            visibleDuration={{ months: shownMonths }}
        >
            <header className={styles.header}>
                <IconButton slot="previous" iconSlot={ChevronLeftIcon} />
                <Heading />
                <IconButton slot="next" iconSlot={ChevronRightIcon} />
            </header>

            <div className={styles.gridWrapper}>
                {Array.from({ length: shownMonths }).map((_, index) => (
                    <CalendarGrid className={styles.grid} key={index} offset={{ months: index + shownMonthsOffset }}>
                        {(date) => <CalendarCell className={styles.cell} date={date} />}
                    </CalendarGrid>
                ))}
            </div>
        </RangeCalendar>
    );
};
