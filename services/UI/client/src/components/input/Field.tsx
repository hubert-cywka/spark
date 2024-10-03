import { ReactNode } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";

import { FieldStyled } from "@/components/input/styles/Field.styled";
import { InputSize } from "@/components/input/types/Input";

type FieldProps<T extends FieldValues> = {
    name: Path<T>;
    control: Control<T>;
    label: ReactNode;
    width?: number;
    size?: InputSize;
    required?: boolean;
    autoComplete?: "email" | "hidden" | "text" | "search" | "url" | "tel" | "date" | "password";
};

export const Field = <T extends FieldValues>({
    width,
    size,
    label,
    required,
    name,
    control,
    ...props
}: FieldProps<T>) => {
    const {
        field,
        fieldState: { invalid, error },
    } = useController({
        name,
        control,
        rules: { required },
    });

    return (
        <FieldStyled.Controller
            {...props}
            onChange={field.onChange}
            onBlur={field.onBlur}
            value={field.value}
            name={field.name}
            ref={field.ref}
            isRequired={required}
            isInvalid={invalid}
            validationBehavior="aria"
        >
            <FieldStyled.Label>
                {label}
                {required && <FieldStyled.RequiredFieldHighlight> *</FieldStyled.RequiredFieldHighlight>}
            </FieldStyled.Label>
            <FieldStyled.Input width={width} size={size} />
            {error && <FieldStyled.Error>{error.message}</FieldStyled.Error>}
        </FieldStyled.Controller>
    );
};
