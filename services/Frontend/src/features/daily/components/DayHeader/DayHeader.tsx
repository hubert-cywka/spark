import { useEffect, useRef, useState } from "react";
import { DateField, DateInput, DateSegment, DateValue } from "react-aria-components";
import { fromDate } from "@internationalized/date";

import styles from "./styles/DayHeader.module.scss";

import { getFormattedDailyDate } from "@/features/daily/utils/dateUtils";

const SEGMENT_SELECTOR = '[role="spinbutton"]';

type DayHeaderProps = {
    date: string;
    isEdited: boolean;
    onChange: (date: string) => void;
};

export const DayHeader = ({ date, isEdited, onChange }: DayHeaderProps) => {
    const [value, setValue] = useState<DateValue | null>(() => mapToDateValue(date));
    const dateFieldRef = useRef<HTMLDivElement>(null);

    useEffect(
        function focusFirstSegment() {
            if (isEdited && dateFieldRef.current) {
                const focusableElement = dateFieldRef.current.querySelector(SEGMENT_SELECTOR);

                if (focusableElement) {
                    (focusableElement as HTMLElement).focus();
                }
            }
        },
        [isEdited]
    );

    useEffect(
        function restoreInitialValue() {
            if (!isEdited) {
                setValue(mapToDateValue(date));
            }
        },
        [date, isEdited]
    );

    const handleOnChange = (dateValue: DateValue | null) => {
        setValue(dateValue);

        if (!dateValue) {
            return;
        }

        onChange(mapToISODate(dateValue));
    };

    return (
        <DateField
            aria-label="Daily date"
            ref={dateFieldRef}
            value={value}
            onChange={handleOnChange}
            granularity="day"
            shouldForceLeadingZeros
            validationBehavior="aria"
            isDisabled={!isEdited}
        >
            <DateInput className={styles.input}>{(segment) => <DateSegment segment={segment} />}</DateInput>
        </DateField>
    );
};

const mapToDateValue = (date: string) => fromDate(new Date(date), "UTC");
const mapToISODate = (date: DateValue) => getFormattedDailyDate(date.toDate("UTC"));
