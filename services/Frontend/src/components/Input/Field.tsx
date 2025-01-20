"use client";

import { ReactNode } from "react";
import { FieldError, Input, Label, TextField, TextFieldProps } from "react-aria-components";

import { InputSize } from "./types/Input";

import styles from "./styles/Input.module.scss";

type FieldProps = TextFieldProps & {
    label?: ReactNode;
    error?: string;
    required?: boolean;
    width?: string;
    size?: InputSize;
    placeholder?: string;
};

export const Field = ({ width, label, required, name, autoComplete, type, size = "2", error, placeholder, ...props }: FieldProps) => {
    return (
        <TextField className={styles.controller} {...props} isRequired={required} isInvalid={!!error} validationBehavior="aria">
            <Label className={styles.label}>
                {label}
                {required && <span className={styles.highlight}> *</span>}
            </Label>
            <Input
                className={styles.input}
                style={{ width }}
                data-size={size}
                type={type}
                autoComplete={autoComplete}
                placeholder={placeholder}
            />
            {error && <FieldError className={styles.error}>{error}</FieldError>}
        </TextField>
    );
};
