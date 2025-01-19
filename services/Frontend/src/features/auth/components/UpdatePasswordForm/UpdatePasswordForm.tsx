"use client";

import { useCallback } from "react";

import { UpdatePasswordFormInputs, useUpdatePasswordForm } from "./hooks/useUpdatePasswordForm";

import sharedStyles from "../../styles/AuthenticationForm.module.scss";

import { Button } from "@/components/Button";
import { Field } from "@/components/Input";
import { useUpdatePassword, useUpdatePasswordEvents } from "@/features/auth/hooks";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

type UpdatePasswordFormProps = {
    passwordChangeToken: string;
};

export const UpdatePasswordForm = ({ passwordChangeToken }: UpdatePasswordFormProps) => {
    const t = useTranslate();
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useUpdatePasswordForm();
    const { mutateAsync, isPending, isSuccess } = useUpdatePassword();
    const { onPasswordUpdateError, onPasswordUpdateSuccess } = useUpdatePasswordEvents();

    const internalOnSubmit = useCallback(
        async ({ password }: UpdatePasswordFormInputs) => {
            try {
                await mutateAsync({ password, passwordChangeToken });
                onPasswordUpdateSuccess();
            } catch (err) {
                onPasswordUpdateError(err);
            }
        },
        [mutateAsync, onPasswordUpdateError, onPasswordUpdateSuccess, passwordChangeToken]
    );

    return (
        <form className={sharedStyles.form} onSubmit={handleSubmit(internalOnSubmit)}>
            <div className={sharedStyles.fieldsWrapper}>
                <Field
                    label={t("authentication.common.fields.password.label")}
                    {...register("password")}
                    type="password"
                    size="3"
                    required
                    error={errors.password?.message}
                />
                <Field
                    label={t("authentication.common.fields.confirmPassword.label")}
                    {...register("confirmPassword")}
                    type="password"
                    size="3"
                    required
                    error={errors.confirmPassword?.message}
                />
            </div>

            <Button isLoading={isPending} isDisabled={isSuccess} size="3" type="submit">
                {t("authentication.passwordReset.form.submitButton")}
            </Button>
        </form>
    );
};
