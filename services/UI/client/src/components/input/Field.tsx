import { ReactNode } from "react";
import { TextFieldProps } from "react-aria-components";

import { FieldStyled } from "@/components/input/styles/Field.styled";
import { InputProps } from "@/components/input/types/Input";

type FieldProps = {
    inputProps: InputProps;
    label: ReactNode;
    error?: string;
} & TextFieldProps;

export const Field = ({ inputProps, error, label, isInvalid, isRequired, ...props }: FieldProps) => {
    const internalIsInvalid = isInvalid ?? !!error;

    return (
        <FieldStyled.Controller {...props} isRequired={isRequired} isInvalid={internalIsInvalid}>
            <FieldStyled.Label>
                {label}
                {isRequired && <FieldStyled.RequiredFieldHighlight> *</FieldStyled.RequiredFieldHighlight>}
            </FieldStyled.Label>
            <FieldStyled.Input {...inputProps} />
            {error && <FieldStyled.Error>{error}</FieldStyled.Error>}
        </FieldStyled.Controller>
    );
};
