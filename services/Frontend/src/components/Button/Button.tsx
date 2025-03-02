"use client";

import { Button as BaseButton } from "react-aria-components";
import clsx from "clsx";

import { ButtonProps } from "./types/Button";

import styles from "./styles/Button.module.scss";

import { Overlay } from "@/components/Overlay";
import { Spinner } from "@/components/Spinner";

export const Button = ({
    children,
    isLoading = false,
    isDisabled = false,
    className,
    variant = "primary",
    size = "2",
    leftDecorator,
    rightDecorator,
    ...rest
}: ButtonProps) => {
    return (
        <BaseButton {...rest} isDisabled={isDisabled} className={clsx(className, styles.button)} data-variant={variant} data-size={size}>
            <>
                {leftDecorator}
                {children}
                {rightDecorator}
                {isLoading && (
                    <Overlay>
                        <Spinner size="1" />
                    </Overlay>
                )}
            </>
        </BaseButton>
    );
};
