"use client";

import { Button as BaseButton } from "react-aria-components";
import clsx from "clsx";

import { ButtonProps } from "./types/Button";

import styles from "./styles/Button.module.scss";

import { Overlay } from "@/components/Overlay";
import { Spinner } from "@/components/Spinner";

export const Button = ({
    children,
    isLoading,
    isDisabled,
    className,
    variant = "primary",
    size = "2",
    leftDecorator,
    ...rest
}: ButtonProps) => {
    return (
        <BaseButton
            {...rest}
            isDisabled={isLoading ?? isDisabled}
            className={clsx(className, styles.button)}
            data-variant={variant}
            data-size={size}
        >
            <>
                {leftDecorator}
                {children}
                {isLoading && (
                    <Overlay>
                        <Spinner size="1" />
                    </Overlay>
                )}
            </>
        </BaseButton>
    );
};
