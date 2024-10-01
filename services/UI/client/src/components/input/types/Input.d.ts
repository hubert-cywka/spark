import { InputProps as BaseInputProps } from "react-aria-components";

export type InputSize = "1" | "2" | "3";

export interface InputProps extends BaseInputProps {
    size?: InputSize;
    name?: string;
}
