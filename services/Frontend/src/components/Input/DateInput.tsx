"use client";

import { ReactNode } from "react";
import { DateField, DateInput as BaseDateInput, DateSegment, FieldError, Label } from "react-aria-components";
import { Control, FieldValues, Path, useController } from "react-hook-form";
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

    return (
        <DateField
            className={sharedStyles.controller}
            {...props}
            onChange={field.onChange}
            onBlur={field.onBlur}
            value={field.value}
            name={field.name}
            ref={field.ref}
            isRequired={required}
            isInvalid={invalid}
            validationBehavior="aria"
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
