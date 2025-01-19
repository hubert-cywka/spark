"use client";

import { ReactNode } from "react";
import { FieldError, Input, Label, NumberField, NumberFieldProps } from "react-aria-components";

import { InputSize } from "./types/Input";

import sharedStyles from "./styles/Input.module.scss";
import ownStyles from "./styles/NumberInput.module.scss";

import { Button } from "@/components/Button";

type NumberInputProps = NumberFieldProps & {
    label: ReactNode;
    error?: string;
    required?: boolean;
    width?: string;
    size?: InputSize;
};

export const NumberInput = ({
    width,
    label,
    required,
    name,
    defaultValue,
    maxValue,
    minValue,
    size = "2",
    error,
    ...props
}: NumberInputProps) => {
    return (
        <NumberField
            className={sharedStyles.controller}
            {...props}
            minValue={minValue}
            maxValue={maxValue}
            defaultValue={defaultValue}
            isRequired={required}
            isInvalid={!!error}
            validationBehavior="aria"
            {...props}
        >
            <Label className={sharedStyles.label}>
                {label}
                {required && <span className={sharedStyles.highlight}> *</span>}
            </Label>

            <div className={ownStyles.numberInputContainer}>
                <Input className={sharedStyles.input} style={{ width }} data-size={size} />

                <div className={ownStyles.buttonsWrapper}>
                    <Button slot="decrement" size={size}>
                        -
                    </Button>
                    <Button slot="increment" size={size}>
                        +
                    </Button>
                </div>
            </div>

            {error && <FieldError className={sharedStyles.error}>{error}</FieldError>}
        </NumberField>
    );
};
