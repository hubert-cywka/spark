"use client";

import { ClipboardEvent, KeyboardEvent, ReactNode, useRef } from "react";
import { FieldError, Input, Label, TextField } from "react-aria-components";
import classNames from "clsx";

import ownStyles from "./styles/CodeInput.module.scss";
import styles from "./styles/Input.module.scss";

const DEFAULT_LENGTH = 6;

type CodeInputProps = {
    label?: ReactNode;
    error?: string;
    required?: boolean;
    length?: number;
    value: string;
    onChange: (value: string) => void;
    onSubmit?: () => void;
    className?: string;
};

export const CodeInput = ({
    value,
    label,
    required,
    length = DEFAULT_LENGTH,
    onChange,
    onSubmit,
    error,
    className,
    ...props
}: CodeInputProps) => {
    const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(length).fill(null));

    const handleInputChange = (index: number, newValue: string) => {
        const alphanumericValue = parseValue(newValue);
        const updatedValue = value.substring(0, index) + alphanumericValue.slice(-1) + value.substring(index + 1);
        onChange(updatedValue);

        const nextInput = inputRefs.current[index + 1];

        if (alphanumericValue.length && index < length - 1 && nextInput) {
            nextInput.focus();
        }
    };

    const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        const pastedText = event.clipboardData.getData("text");
        const alphanumericPastedText = parseValue(pastedText);
        const truncatedPastedText = alphanumericPastedText.slice(0, length);

        onChange(truncatedPastedText);

        if (inputRefs.current[truncatedPastedText.length]) {
            inputRefs.current[truncatedPastedText.length]?.focus();
        }
    };

    const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
        const previousInput = inputRefs.current[index - 1];

        if (event.key === "Backspace" && !event.currentTarget.value && index > 0 && previousInput) {
            previousInput.focus();
        }

        if (event.key === "Enter") {
            onSubmit?.();
        }
    };

    return (
        <TextField
            className={classNames(styles.controller, className)}
            {...props}
            isRequired={required}
            isInvalid={!!error}
            validationBehavior="aria"
        >
            <Label className={styles.label}>
                {label}
                {required && <span className={styles.highlight}> *</span>}
            </Label>

            <div className={ownStyles.segmentsContainer}>
                {Array.from({ length }).map((_, index) => (
                    <Input
                        key={index}
                        ref={(node) => {
                            inputRefs.current[index] = node;
                        }}
                        className={classNames(styles.input, ownStyles.segment)}
                        value={value[index] ?? ""}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                    />
                ))}
            </div>

            {error && <FieldError className={styles.error}>{error}</FieldError>}
        </TextField>
    );
};

const parseValue = (value: string) => value.replace(/[^a-zA-Z0-9]/g, "");
