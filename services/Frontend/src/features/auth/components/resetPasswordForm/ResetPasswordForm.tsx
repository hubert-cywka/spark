"use client";

import { useCallback } from "react";

import { ResetPasswordFormInputs, useResetPasswordForm } from "./hooks/useResetPasswordForm";

import sharedStyles from "../../styles/AuthenticationForm.module.scss";

import { Button } from "@/components/Button";
import { Field } from "@/components/Input";
import { useRequestPasswordResetToken } from "@/features/auth/hooks/useRequestPasswordResetToken";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

export const ResetPasswordForm = () => {
    const t = useTranslate();

    const { control, handleSubmit } = useResetPasswordForm();
    const { mutateAsync, isSuccess, isPending } = useRequestPasswordResetToken();

    const internalOnSubmit = useCallback(
        ({ email }: ResetPasswordFormInputs) => {
            void mutateAsync({ email: email.trim() });
        },
        [mutateAsync]
    );

    return (
        <form className={sharedStyles.form} onSubmit={handleSubmit(internalOnSubmit)}>
            <div className={sharedStyles.fieldsWrapper}>
                <Field
                    label={t("authentication.common.fields.email.label")}
                    name="email"
                    control={control}
                    autoComplete="email"
                    size="3"
                    required
                />
            </div>

            <Button isLoading={isPending} isDisabled={isSuccess} size="3" type="submit">
                {t("authentication.requestPasswordReset.form.submitButton")}
            </Button>
        </form>
    );
};
