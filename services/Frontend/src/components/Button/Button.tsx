"use client";

import { forwardRef } from "react";
import { Button as BaseButton } from "react-aria-components";
import clsx from "clsx";

import { ButtonProps } from "./types/Button";

import styles from "./styles/Button.module.scss";

import { Spinner } from "@/components/Spinner";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            isLoading = false,
            isDisabled = false,
            className,
            variant = "primary",
            size = "2",
            leftDecorator,
            rightDecorator,
            ...rest
        },
        ref
    ) => {
        return (
            <BaseButton
                {...rest}
                ref={ref}
                isPending={isLoading}
                isDisabled={isDisabled}
                className={clsx(className, styles.button)}
                data-variant={variant}
                data-size={size}
            >
                <>
                    {leftDecorator}
                    {children}
                    {isLoading ? <Spinner size="1" /> : rightDecorator}
                </>
            </BaseButton>
        );
    }
);

Button.displayName = "Button";
