"use client";

import { ReactNode } from "react";
import { DateField, DateValue, FieldError, Label } from "react-aria-components";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { fromDate } from "@internationalized/date";

import { InputSize } from "./types/Input";

import sharedStyles from "./styles/Input.module.scss";

import { SegmentedDateInputSlot } from "@/components/Input/SegmentedDateInputSlot";

type DateInputProps<T extends FieldValues> = {
    name: Path<T>;
    control: Control<T>;
    label: ReactNode;
    size?: InputSize;
    required?: boolean;
    defaultValue?: Date;
};

export const DateInput = <T extends FieldValues>({
    defaultValue,
    label,
    required,
    name,
    control,
    size = "2",
    ...props
}: DateInputProps<T>) => {
    const {
        field,
        fieldState: { invalid, error },
    } = useController({
        name,
        control,
        rules: { required },
    });

    const onChange = (value: DateValue | null) => {
        field.onChange(value?.toDate("UTC"));
    };

    return (
        <DateField
            {...props}
            className={sharedStyles.controller}
            onChange={onChange}
            value={convertValue(field.value)}
            defaultValue={convertValue(defaultValue)}
            onBlur={field.onBlur}
            name={field.name}
            ref={field.ref}
            isRequired={required}
            isInvalid={invalid}
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

            {error && <FieldError className={sharedStyles.error}>{error.message}</FieldError>}
        </DateField>
    );
};

const convertValue = (value: Date | undefined) => {
    return value ? fromDate(value, "UTC") : undefined;
};
