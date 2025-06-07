import { ReactNode } from "react";
import { DateRangePicker as BaseDateRangePicker, DateValue, FieldError, Label } from "react-aria-components";
import { fromDate } from "@internationalized/date";
import classNames from "clsx";
import { CalendarIcon } from "lucide-react";

import styles from "./styles/DateRangePicker.module.scss";
import sharedStyles from "@/components/Input/styles/Input.module.scss";

import { Calendar } from "@/components/Calendar";
import { IconButton } from "@/components/IconButton";
import { InputSize } from "@/components/Input";
import { SegmentedDateInputSlot } from "@/components/Input/SegmentedDateInputSlot";
import { Popover } from "@/components/Popover";
import { formatToISODateString } from "@/features/daily/utils/dateUtils";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";
import { ISODateStringRange } from "@/types/ISODateString";

type DateRangePickerProps = {
    label: ReactNode;
    value: ISODateStringRange | null;
    onChange?: (value: ISODateStringRange) => void;
    calendarProps?: {
        shownMonths?: number;
    };
    size?: InputSize;
    required?: boolean;
    error?: string;
};

export const DateRangePicker = ({ size = "2", label, value, error, onChange, required, calendarProps }: DateRangePickerProps) => {
    const t = useTranslate();

    const onChangeInternal = (value: { start: DateValue; end: DateValue } | null) => {
        if (!value) {
            return;
        }

        onChange?.({
            from: formatToISODateString(new Date(value.start.toString())),
            to: formatToISODateString(new Date(value.end.toString())),
        });
    };

    return (
        <BaseDateRangePicker
            onChange={onChangeInternal}
            isInvalid={!!error}
            isRequired={required}
            value={convertValue(value)}
            granularity="day"
            hideTimeZone
        >
            <Label className={sharedStyles.label}>
                {label}
                {required && <span className={sharedStyles.highlight}> *</span>}
            </Label>

            <div className={styles.wrapper}>
                <div className={classNames(styles.inputsWrapper, sharedStyles.input)}>
                    <SegmentedDateInputSlot size={size} slot="start" />
                    <span aria-hidden="true"> – </span>
                    <SegmentedDateInputSlot size={size} slot="end" />
                </div>

                <Popover
                    trigger={
                        <IconButton
                            size={size}
                            iconSlot={CalendarIcon}
                            tooltip={t("common.dateRangePicker.showCalendarButton.label")}
                            aria-label={t("common.dateRangePicker.showCalendarButton.label")}
                        />
                    }
                >
                    <Calendar value={value} shownMonths={calendarProps?.shownMonths} />
                </Popover>
            </div>

            {error && <FieldError className={sharedStyles.error}>{error}</FieldError>}
        </BaseDateRangePicker>
    );
};

const convertValue = (value: ISODateStringRange | null) => {
    if (!value) {
        return value;
    }

    return {
        start: fromDate(new Date(value.from), "UTC"),
        end: fromDate(new Date(value.to), "UTC"),
    };
};
