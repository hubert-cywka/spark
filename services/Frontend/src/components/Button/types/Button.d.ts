import { PropsWithChildren, ReactNode } from "react";
import { ButtonProps as BaseButtonProps } from "react-aria-components";

export type ButtonVariant = "primary" | "secondary" | "confirm" | "danger" | "subtle" | "link";
export type ButtonSize = "1" | "2" | "3";

export type ButtonProps = BaseButtonProps &
    PropsWithChildren<{
        variant?: ButtonVariant;
        size?: ButtonSize;
        name?: string;
        isLoading?: boolean;
        leftDecorator?: ReactNode;
        rightDecorator?: ReactNode;
        isPending?: never;
    }>;
