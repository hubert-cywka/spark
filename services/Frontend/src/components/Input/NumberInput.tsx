"use client";

import { ReactNode } from "react";
import { FieldError, Input, Label, NumberField } from "react-aria-components";
import { Control, FieldValues, Path, useController } from "react-hook-form";

import { InputSize } from "./types/Input";

import sharedStyles from "./styles/Input.module.scss";
import ownStyles from "./styles/NumberInput.module.scss";

import { Button } from "@/components/Button";

type NumberInputProps<T extends FieldValues> = {
    name: Path<T>;
    control: Control<T>;
    label: ReactNode;
    defaultValue?: number;
    minValue?: number;
    maxValue?: number;
    width?: string;
    size?: InputSize;
    required?: boolean;
};

export const NumberInput = <T extends FieldValues>({
    width,
    label,
    required,
    name,
    control,
    defaultValue,
    maxValue,
    minValue,
    size = "2",
    ...props
}: NumberInputProps<T>) => {
    const {
        field,
        fieldState: { invalid, error },
    } = useController({
        name,
        control,
        rules: { required },
    });

    return (
        <NumberField
            className={sharedStyles.controller}
            {...props}
            onChange={field.onChange}
            onBlur={field.onBlur}
            value={field.value}
            name={field.name}
            ref={field.ref}
            minValue={minValue}
            maxValue={maxValue}
            defaultValue={defaultValue}
            isRequired={required}
            isInvalid={invalid}
            validationBehavior="aria"
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

            {error && <FieldError className={sharedStyles.error}>{error.message}</FieldError>}
        </NumberField>
    );
};
