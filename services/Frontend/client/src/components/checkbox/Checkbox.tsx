import { ReactNode } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";

import { CheckboxStyled } from "@/components/checkbox/styles/Checkbox.styled";

export type CheckboxProps<T extends FieldValues> = {
    name: Path<T>;
    control: Control<T>;
    required?: boolean;
    children?: ReactNode;
};

export const Checkbox = <T extends FieldValues>({ children, required, control, name }: CheckboxProps<T>) => {
    const {
        field,
        fieldState: { invalid },
    } = useController({
        name,
        control,
        rules: { required },
    });

    return (
        <CheckboxStyled.Checkbox
            onChange={field.onChange}
            onBlur={field.onBlur}
            value={field.value}
            name={field.name}
            ref={field.ref}
            isRequired={required}
            isInvalid={invalid}
            validationBehavior="aria"
        >
            <>
                <CheckboxStyled.SvgWrapper>
                    <CheckboxStyled.Svg viewBox="0 0 18 18" aria-hidden="true">
                        <polyline points="1 9 7 14 15 4" />
                    </CheckboxStyled.Svg>
                </CheckboxStyled.SvgWrapper>

                {children}
                {required && <CheckboxStyled.RequiredMark>*</CheckboxStyled.RequiredMark>}
            </>
        </CheckboxStyled.Checkbox>
    );
};
