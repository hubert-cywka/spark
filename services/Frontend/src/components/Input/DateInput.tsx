"use client";

import React, { ChangeEventHandler, forwardRef, ReactNode, useCallback, useEffect } from "react";
import { DateField, DateFieldProps as RacDateFieldProps, DateValue, FieldError, Label } from "react-aria-components";
import { fromDate } from "@internationalized/date";

import { InputSize } from "./types/Input";

import sharedStyles from "./styles/Input.module.scss";

import { SegmentedDateInputSlot } from "@/components/Input/SegmentedDateInputSlot";

type DateInputProps = {
    value?: Date | null | undefined;
    defaultValue?: Date | null | undefined;
    onChange: (value: Date | undefined) => void;
    onBlur?: ChangeEventHandler;
    name: string;
    label: ReactNode;
    size?: InputSize;
    required?: boolean;
    error?: ReactNode;
    minValue?: Date;
    maxValue?: Date;
    placeholderValue?: Date;
} & Omit<
    RacDateFieldProps<DateValue>,
    "value" | "onChange" | "onBlur" | "name" | "children" | "minValue" | "maxValue" | "placeholderValue" | "defaultValue" | "isRequired"
>;

const convertToDateValue = (value: Date | undefined | null): DateValue | undefined => {
    if (value instanceof Date && !isNaN(value.getTime())) {
        return fromDate(value, "UTC");
    }
    return undefined;
};

export const DateInput = forwardRef<HTMLDivElement, DateInputProps>(
    (
        {
            value,
            defaultValue,
            onChange,
            onBlur,
            name,
            label,
            required,
            isInvalid,
            error,
            size = "2",
            minValue,
            maxValue,
            placeholderValue,
            ...props
        },
        ref
    ) => {
        const internalDefaultDateValue = convertToDateValue(defaultValue);
        const internalDateValue = convertToDateValue(value);
        const internalMinValue = convertToDateValue(minValue);
        const internalMaxValue = convertToDateValue(maxValue);
        const internalPlaceholderValue = convertToDateValue(placeholderValue);

        const handleChange = useCallback(
            (newValue: DateValue | null) => {
                onChange(newValue ? newValue.toDate("UTC") : undefined);
            },
            [onChange]
        );

        useEffect(() => {
            if (!internalDateValue && internalDefaultDateValue) {
                handleChange(internalDefaultDateValue);
            }
        }, [handleChange, internalDateValue, internalDefaultDateValue]);

        return (
            <DateField
                {...props}
                ref={ref}
                className={sharedStyles.controller}
                value={internalDateValue}
                defaultValue={internalDefaultDateValue}
                minValue={internalMinValue}
                maxValue={internalMaxValue}
                placeholderValue={internalPlaceholderValue}
                onChange={handleChange}
                onBlur={onBlur}
                name={name}
                isRequired={required}
                isInvalid={isInvalid}
                granularity="day"
                shouldForceLeadingZeros
                validationBehavior="aria"
                hideTimeZone
            >
                <Label className={sharedStyles.label}>
                    {label}
                    {required && <span className={sharedStyles.highlight}> *</span>}
                </Label>

                <SegmentedDateInputSlot className={sharedStyles.input} size={size} />

                {isInvalid && error && <FieldError className={sharedStyles.error}>{error}</FieldError>}
            </DateField>
        );
    }
);

DateInput.displayName = "DateInput";
