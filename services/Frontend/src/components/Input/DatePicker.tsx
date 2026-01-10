import { DatePicker as BaseDatePicker, DateValue, FieldError, Label } from "react-aria-components";
import { fromDate } from "@internationalized/date";
import classNames from "clsx";
import { CalendarIcon } from "lucide-react";

import styles from "./styles/DateRangePicker.module.scss";
import sharedStyles from "@/components/Input/styles/Input.module.scss";

import { Calendar } from "@/components/Calendar";
import { IconButton } from "@/components/IconButton";
import { SegmentedDateInputSlot } from "@/components/Input/SegmentedDateInputSlot";
import { DatePickerBaseProps } from "@/components/Input/types/DatePickerBaseProps";
import { Popover } from "@/components/Popover";
import { formatToISODateString } from "@/features/daily/utils/dateUtils";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";
import { ISODateString } from "@/types/ISODateString";

type DatePickerProps = DatePickerBaseProps & {
    value: ISODateString | null;
    onChange?: (value: ISODateString) => void;
};

export const DatePicker = ({ size = "2", label, value, error, onChange, required, calendarProps, minimal, className }: DatePickerProps) => {
    const t = useTranslate();

    const onChangeInternal = (value: DateValue | null) => {
        if (!value) {
            return;
        }

        onChange?.(formatToISODateString(new Date(value.toString())));
    };

    return (
        <BaseDatePicker
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
                        <SegmentedDateInputSlot size={size} />
                    </div>
                )}

                <Popover
                    trigger={
                        <IconButton
                            size={size}
                            iconSlot={CalendarIcon}
                            variant="subtle"
                            tooltip={t("common.datePicker.showCalendarButton.label")}
                            aria-label={t("common.datePicker.showCalendarButton.label")}
                        />
                    }
                >
                    <Calendar value={value} shownMonths={calendarProps?.shownMonths} />
                </Popover>
            </div>

            {!minimal && error && <FieldError className={sharedStyles.error}>{error}</FieldError>}
        </BaseDatePicker>
    );
};

const convertValue = (value: ISODateString | null) => {
    if (!value) {
        return value;
    }

    return fromDate(new Date(value), "UTC");
};
