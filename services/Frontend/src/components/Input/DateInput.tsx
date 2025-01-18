"use client";

import { ReactNode } from "react";
import { DateField, DateFieldProps, DateInput as BaseDateInput, DateSegment, DateValue, FieldError, Label } from "react-aria-components";
import { fromDate } from "@internationalized/date";
import classNames from "clsx";

import { InputSize } from "./types/Input";

import ownStyles from "./styles/DateInput.module.scss";
import sharedStyles from "./styles/Input.module.scss";

type DateInputProps = Omit<DateFieldProps<DateValue>, "value" | "onChange"> & {
    label: ReactNode;
    error?: string;
    size?: InputSize;
    required?: boolean;
    value?: Date | string | number;
    onChange?: (value?: Date | string | number) => void;
};

export const DateInput = ({ label, required = false, error, size = "2", value, onChange, ...props }: DateInputProps) => {
    const handleChange = (newValue: DateValue | null) => {
        onChange?.(newValue?.toDate("UTC"));
    };

    return (
        <DateField
            {...props}
            className={sharedStyles.controller}
            isRequired={required}
            isInvalid={!!error}
            granularity="day"
            shouldForceLeadingZeros
            validationBehavior="aria"
            hideTimeZone
            onChange={handleChange}
            value={value ? fromDate(value as Date, "UTC") : undefined}
        >
            <Label className={sharedStyles.label}>
                {label}
                {required && <span className={sharedStyles.highlight}> *</span>}
            </Label>

            <BaseDateInput className={classNames(sharedStyles.input, ownStyles.input)} data-size={size}>
                {(segment) => <DateSegment className={ownStyles.dateSegment} segment={segment} />}
            </BaseDateInput>

            {error && <FieldError className={sharedStyles.error}>{error}</FieldError>}
        </DateField>
    );
};
