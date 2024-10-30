"use client";

import { useCallback } from "react";

import sharedStyles from "../../styles/AuthenticationForm.module.scss";

import { Button } from "@/components/button/Button";
import { Field } from "@/components/input/Field";
import { ResetPasswordFormInputs, useResetPasswordForm } from "@/features/auth/components/resetPasswordForm/hooks/useResetPasswordForm";
import { useResetPasswordFormEvents } from "@/features/auth/components/resetPasswordForm/hooks/useResetPasswordFormEvents";
import { useRequestPasswordResetToken } from "@/features/auth/hooks/useRequestPasswordResetToken";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

export const ResetPasswordForm = () => {
    const t = useTranslate();

    const { control, handleSubmit } = useResetPasswordForm();
    const { mutateAsync, isSuccess, isPending } = useRequestPasswordResetToken();
    const { onPasswordResetRequestError, onPasswordResetRequestSuccess } = useResetPasswordFormEvents();

    const internalOnSubmit = useCallback(
        async ({ email }: ResetPasswordFormInputs) => {
            try {
                await mutateAsync({ email: email.trim() });
                onPasswordResetRequestSuccess?.();
            } catch (err) {
                onPasswordResetRequestError?.(err);
            }
        },
        [onPasswordResetRequestError, onPasswordResetRequestSuccess, mutateAsync]
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
