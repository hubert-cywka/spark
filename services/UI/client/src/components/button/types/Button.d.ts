import { ButtonProps as BaseButtonProps } from "react-aria-components";

export type ButtonVariant = "primary" | "secondary" | "confirm" | "danger" | "subtle";
export type ButtonSize = "1" | "2" | "3";

export interface ButtonProps extends BaseButtonProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    name?: string;
    isLoading?: boolean;
}
