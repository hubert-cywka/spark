"use client";

import { ReactNode } from "react";
import { DateField, DateInput as BaseDateInput, DateSegment, DateValue, FieldError, Label } from "react-aria-components";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { fromDate } from "@internationalized/date";
import classNames from "clsx";

import { InputSize } from "./types/Input";

import ownStyles from "./styles/DateInput.module.scss";
import sharedStyles from "./styles/Input.module.scss";

type DateInputProps<T extends FieldValues> = {
    name: Path<T>;
    control: Control<T>;
    label: ReactNode;
    size?: InputSize;
    required?: boolean;
};

export const DateInput = <T extends FieldValues>({ label, required, name, control, size = "2", ...props }: DateInputProps<T>) => {
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
            value={field.value ? fromDate(field.value, "UTC") : undefined}
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

            <BaseDateInput className={classNames(sharedStyles.input, ownStyles.input)} data-size={size}>
                {(segment) => <DateSegment className={ownStyles.dateSegment} segment={segment} />}
            </BaseDateInput>

            {error && <FieldError className={sharedStyles.error}>{error.message}</FieldError>}
        </DateField>
    );
};
