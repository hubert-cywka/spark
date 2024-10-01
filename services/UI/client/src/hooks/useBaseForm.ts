import { BaseSyntheticEvent, useMemo } from "react";
import {
    FieldErrors,
    FieldValues,
    Path,
    Resolver,
    SubmitErrorHandler,
    SubmitHandler,
    useForm,
    UseFormRegisterReturn,
    UseFormReset,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ObjectSchema } from "yup";

export type UseBaseForm<T extends FieldValues> = {
    handleSubmit: (
        onValid: SubmitHandler<T>,
        onInvalid?: SubmitErrorHandler<T>
    ) => (e?: BaseSyntheticEvent) => Promise<void>;
    fields: {
        [Key in keyof T]: () => UseFormRegisterReturn<string>;
    };
    errors: FieldErrors<T>;
    reset: UseFormReset<T>;
};

export const useBaseForm = <T extends FieldValues>(schema: ObjectSchema<T>): UseBaseForm<T> => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<T>({
        resolver: yupResolver<T>(schema) as unknown as Resolver<T>,
    });

    return useMemo(
        () => ({
            fields: Object.keys(schema.fields).reduce(
                (acc, key) => {
                    acc[key as Path<T>] = () => register(key as Path<T>);
                    return acc;
                },
                {} as Record<keyof T, () => UseFormRegisterReturn<string>>
            ),
            handleSubmit,
            reset,
            errors,
        }),
        [schema.fields, handleSubmit, reset, errors, register]
    );
};
