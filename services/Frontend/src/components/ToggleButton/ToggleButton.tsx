"use client";

import { ToggleButton as BaseToggleButton } from "react-aria-components";
import clsx from "clsx";

import styles from "./styles/ToggleButton.module.scss";

import { ToggleButtonProps } from "@/components/ToggleButton/types/ToggleButton";

export const ToggleButton = ({
    children,
    className,
    size = "2",
    isDisabled,
    rightDecorator,
    leftDecorator,
    ...rest
}: ToggleButtonProps) => {
    return (
        <BaseToggleButton {...rest} isDisabled={isDisabled} className={clsx(className, styles.button)} data-size={size}>
            <>
                {leftDecorator}
                {children}
                {rightDecorator}
            </>
        </BaseToggleButton>
    );
};
