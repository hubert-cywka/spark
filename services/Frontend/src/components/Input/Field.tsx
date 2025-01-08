"use client";

import { InputHTMLAttributes, ReactNode } from "react";
import { FieldError, Input, Label, TextField } from "react-aria-components";
import { Control, FieldValues, Path, useController } from "react-hook-form";

import { InputSize } from "./types/Input";

import styles from "./styles/Input.module.scss";

type FieldProps<T extends FieldValues> = {
    name: Path<T>;
    control: Control<T>;
    label: ReactNode;
    width?: number;
    size?: InputSize;
    required?: boolean;
    autoComplete?: InputHTMLAttributes<unknown>["autoComplete"];
    type?: InputHTMLAttributes<unknown>["type"];
};

export const Field = <T extends FieldValues>({
    width,
    label,
    required,
    name,
    control,
    autoComplete,
    type,
    size = "2",
    ...props
}: FieldProps<T>) => {
    const {
        field,
        fieldState: { invalid, error },
    } = useController({
        name,
        control,
        rules: { required },
    });

    return (
        <TextField
            className={styles.controller}
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
            <Label className={styles.label}>
                {label}
                {required && <span className={styles.highlight}> *</span>}
            </Label>
            <Input className={styles.input} width={width} data-size={size} type={type} autoComplete={autoComplete} />
            {error && <FieldError className={styles.error}>{error.message}</FieldError>}
        </TextField>
    );
};
