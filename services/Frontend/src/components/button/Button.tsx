"use client";

import { Button as BaseButton } from "react-aria-components";
import clsx from "clsx";

import styles from "./styles/Button.module.scss";

import { ButtonProps } from "@/components/button/types/Button";
import { Spinner } from "@/components/spinner/Spinner";

export const Button = ({ children, isLoading, isDisabled, className, variant = "primary", size = "2", ...rest }: ButtonProps) => {
    return (
        <BaseButton
            {...rest}
            isDisabled={isLoading ?? isDisabled}
            className={clsx(className, styles.button)}
            data-variant={variant}
            data-size={size}
        >
            {isLoading ? <Spinner size="1" /> : children}
        </BaseButton>
    );
};
