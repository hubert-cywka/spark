"use client";

import { useCallback } from "react";

import { ResetPasswordFormInputs, useResetPasswordForm } from "./hooks/useResetPasswordForm";

import sharedStyles from "../../styles/AuthenticationForm.module.scss";

import { AppRoute } from "@/app/appRoute";
import { Button } from "@/components/Button";
import { Field } from "@/components/Input";
import { useRequestPasswordResetToken, useRequestPasswordResetTokenEvents } from "@/features/auth/hooks";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { getAbsoluteAppUrl } from "@/utils/appUrl";

export const ResetPasswordForm = () => {
    const t = useTranslate();

    const { register, handleSubmit } = useResetPasswordForm();
    const { mutateAsync, isSuccess, isPending } = useRequestPasswordResetToken();
    const { onPasswordResetRequestError, onPasswordResetRequestSuccess } = useRequestPasswordResetTokenEvents();

    const internalOnSubmit = useCallback(
        async ({ email }: ResetPasswordFormInputs) => {
            try {
                await mutateAsync({
                    email: email.trim(),
                    redirectUrl: getAbsoluteAppUrl(AppRoute.RESET_PASSWORD),
                });
                onPasswordResetRequestSuccess();
            } catch (err) {
                onPasswordResetRequestError(err);
            }
        },
        [mutateAsync, onPasswordResetRequestError, onPasswordResetRequestSuccess]
    );

    return (
        <form className={sharedStyles.form} onSubmit={handleSubmit(internalOnSubmit)}>
            <div className={sharedStyles.fieldsWrapper}>
                <Field
                    label={t("authentication.common.fields.email.label")}
                    {...register("email")}
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
