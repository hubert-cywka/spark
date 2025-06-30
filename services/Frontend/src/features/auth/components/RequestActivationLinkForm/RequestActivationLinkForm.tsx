"use client";

import { useCallback } from "react";

import { RequestAccountActivationFormInputs, useRequestAccountActivationLinkForm } from "./hooks/useRequestAccountActivationLinkForm";

import sharedStyles from "../../styles/AuthenticationForm.module.scss";

import { AppRoute } from "@/app/appRoute";
import { Button } from "@/components/Button";
import { Field } from "@/components/Input";
import { useRequestAccountActivationToken, useRequestAccountActivationTokenEvents } from "@/features/auth/hooks";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { getAbsoluteAppUrl } from "@/utils/urlUtils";

export const RequestActivationLinkForm = () => {
    const t = useTranslate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useRequestAccountActivationLinkForm();
    const { mutateAsync, isPending, isSuccess } = useRequestAccountActivationToken();
    const { onRequestActivationError, onRequestActivationSuccess } = useRequestAccountActivationTokenEvents();

    const internalOnSubmit = useCallback(
        async ({ email }: RequestAccountActivationFormInputs) => {
            try {
                await mutateAsync({
                    email: email.trim(),
                    redirectUrl: getAbsoluteAppUrl(AppRoute.ACTIVATE_ACCOUNT),
                });
                onRequestActivationSuccess();
            } catch (err) {
                onRequestActivationError(err);
            }
        },
        [mutateAsync, onRequestActivationError, onRequestActivationSuccess]
    );

    return (
        <form className={sharedStyles.form} onSubmit={handleSubmit(internalOnSubmit)}>
            <div className={sharedStyles.fieldsWrapper}>
                <Field
                    label={t("authentication.common.fields.email.label")}
                    autoComplete="email"
                    size="3"
                    required
                    {...register("email")}
                    error={errors.email?.message}
                />
            </div>

            <Button type="submit" isLoading={isPending} isDisabled={isSuccess} size="3">
                {t("authentication.accountActivation.form.submitButton")}
            </Button>
        </form>
    );
};
