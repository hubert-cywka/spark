"use client";

import { Checkbox as BaseCheckbox } from "react-aria-components";

import { CheckboxProps } from "./types/Checkbox";

import styles from "./styles/Checkbox.module.scss";

export const Checkbox = ({ children, required, error, ...rest }: CheckboxProps) => {
    return (
        <BaseCheckbox className={styles.checkbox} isRequired={required} validationBehavior="aria" {...rest} isInvalid={!!error}>
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
