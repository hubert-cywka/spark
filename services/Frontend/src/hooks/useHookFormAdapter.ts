import { useCallback } from "react";
import { FieldValues, Path, PathValue, useForm, UseFormProps, UseFormRegister, UseFormReturn } from "react-hook-form";

type RegisterResult<T extends FieldValues> = (field: Path<T>) => Omit<ReturnType<UseFormRegister<T>>, "onChange"> & {
    onChange: (value: PathValue<T, Path<T>>) => void;
};

type UseHookFormAdapterOptions<T extends FieldValues> = UseFormProps<T>;
type UseHookFormAdapterResult<T extends FieldValues> = Omit<UseFormReturn<T>, "register"> & {
    register: RegisterResult<T>;
};

export const useHookFormAdapter = <T extends FieldValues>(options?: UseHookFormAdapterOptions<T>): UseHookFormAdapterResult<T> => {
    const { register, setValue, ...rest } = useForm<T>(options);

    const adaptedRegister: RegisterResult<T> = useCallback(
        (field: Path<T>) => ({
            ...register(field),
            onChange: (value) => {
                setValue(field, value);
            },
        }),
        [register, setValue]
    );

    return { ...rest, register: adaptedRegister, setValue };
};
