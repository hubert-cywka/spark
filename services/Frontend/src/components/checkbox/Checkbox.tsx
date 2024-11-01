"use client";

import { Checkbox as BaseCheckbox } from "react-aria-components";
import { FieldValues, useController } from "react-hook-form";

import { CheckboxProps } from "./types/Checkbox";

import styles from "./styles/Checkbox.module.scss";

export const Checkbox = <T extends FieldValues>({ children, required, control, name }: CheckboxProps<T>) => {
    const {
        field,
        fieldState: { invalid },
    } = useController({
        name,
        control,
        rules: { required },
    });

    return (
        <BaseCheckbox
            className={styles.checkbox}
            onChange={field.onChange}
            onBlur={field.onBlur}
            value={field.value}
            name={field.name}
            ref={field.ref}
            isRequired={required}
            isInvalid={invalid}
            validationBehavior="aria"
        >
            <>
                <div className={styles.svgWrapper}>
                    <svg viewBox="0 0 18 18" aria-hidden="true">
                        <polyline points="1 9 7 14 15 4" />
                    </svg>
                </div>

                {children}
                {required && <span className={styles.requiredMark}>*</span>}
            </>
        </BaseCheckbox>
    );
};
