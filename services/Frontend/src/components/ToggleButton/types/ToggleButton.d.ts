import { PropsWithChildren, ReactNode } from "react";
import { ToggleButtonProps as BaseToggleButtonProps } from "react-aria-components";

export type ButtonSize = "1" | "2" | "3";

export type ToggleButtonProps = BaseToggleButtonProps &
    PropsWithChildren<{
        size?: ButtonSize;
        leftDecorator?: ReactNode;
        rightDecorator?: ReactNode;
    }>;
