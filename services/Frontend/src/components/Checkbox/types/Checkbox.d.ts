import { ReactNode } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

export type CheckboxProps<T extends FieldValues> = {
    name: Path<T>;
    control: Control<T>;
    required?: boolean;
    children?: ReactNode;
};
