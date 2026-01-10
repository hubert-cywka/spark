import { DateRangePicker as BaseDateRangePicker, DateValue, FieldError, Label } from "react-aria-components";
import { parseDate } from "@internationalized/date";
import classNames from "clsx";
import { CalendarIcon } from "lucide-react";

import styles from "./styles/DateRangePicker.module.scss";
import sharedStyles from "@/components/Input/styles/Input.module.scss";

import { RangeCalendar } from "@/components/Calendar";
import { IconButton } from "@/components/IconButton";
import { SegmentedDateInputSlot } from "@/components/Input/SegmentedDateInputSlot";
import { DatePickerBaseProps } from "@/components/Input/types/DatePickerBaseProps";
import { Popover } from "@/components/Popover";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";
import { ISODateString, ISODateStringRange } from "@/types/ISODateString";

type DateRangePickerProps = DatePickerBaseProps & {
    value: ISODateStringRange | null;
    onChange?: (value: ISODateStringRange) => void;
};

export const DateRangePicker = ({
    autoFocus,
    size = "2",
    label,
    value,
    error,
    onChange,
    required,
    calendarProps,
    minimal,
    className,
}: DateRangePickerProps) => {
    const t = useTranslate();

    const onChangeInternal = (value: { start: DateValue; end: DateValue } | null) => {
        if (!value) {
            return;
        }

        onChange?.({
            from: value.start.toString() as ISODateString,
            to: value.end.toString() as ISODateString,
        });
    };

    return (
        <BaseDateRangePicker
            autoFocus={autoFocus}
            onChange={onChangeInternal}
            isInvalid={!!error}
            isRequired={required}
            value={convertValue(value)}
            granularity="day"
            hideTimeZone
        >
            {!minimal && (
                <Label className={sharedStyles.label}>
                    {label}
                    {required && <span className={sharedStyles.highlight}> *</span>}
                </Label>
            )}

            <div className={classNames(styles.wrapper, sharedStyles.input, className)}>
                {!minimal && (
                    <div className={styles.inputsWrapper} data-size={size}>
                        <SegmentedDateInputSlot size={size} slot="start" />
                        <span aria-hidden="true"> – </span>
                        <SegmentedDateInputSlot size={size} slot="end" />
                    </div>
                )}

                <Popover
                    trigger={
                        <IconButton
                            size={size}
                            iconSlot={CalendarIcon}
                            variant="subtle"
                            tooltip={t("common.dateRangePicker.showCalendarButton.label")}
                            aria-label={t("common.dateRangePicker.showCalendarButton.label")}
                        />
                    }
                >
                    <RangeCalendar value={value} shownMonths={calendarProps?.shownMonths} />
                </Popover>
            </div>

            {!minimal && error && <FieldError className={sharedStyles.error}>{error}</FieldError>}
        </BaseDateRangePicker>
    );
};

const convertValue = (value: ISODateStringRange | null) => {
    if (!value || !value.from || !value.to) {
        return null;
    }

    try {
        const start = parseDate(value.from.split("T")[0]);
        const end = parseDate(value.to.split("T")[0]);

        return { start, end };
    } catch (e) {
        return null;
    }
};
