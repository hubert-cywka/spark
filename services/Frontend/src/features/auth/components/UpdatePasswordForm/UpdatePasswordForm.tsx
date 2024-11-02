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
    const { handleSubmit, control } = useUpdatePasswordForm();
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
                    name="password"
                    type="password"
                    control={control}
                    size="3"
                    required
                />
                <Field
                    label={t("authentication.common.fields.confirmPassword.label")}
                    name="confirmPassword"
                    type="password"
                    control={control}
                    size="3"
                    required
                />
            </div>

            <Button isLoading={isPending} isDisabled={isSuccess} size="3" type="submit">
                {t("authentication.passwordReset.form.submitButton")}
            </Button>
        </form>
    );
};
