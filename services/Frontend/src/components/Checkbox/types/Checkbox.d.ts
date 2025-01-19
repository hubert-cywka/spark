import { ReactNode } from "react";
import { CheckboxProps as BaseCheckboxProps } from "react-aria-components";

export type CheckboxProps = BaseCheckboxProps & {
    required?: boolean;
    children?: ReactNode;
    error?: string;
};
