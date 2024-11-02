"use client";

import { useCallback } from "react";

import { RequestAccountActivationFormInputs, useRequestAccountActivationLinkForm } from "./hooks/useRequestAccountActivationLinkForm";

import sharedStyles from "../../styles/AuthenticationForm.module.scss";

import { Button } from "@/components/Button";
import { Field } from "@/components/Input";
import { useRequestAccountActivationToken, useRequestAccountActivationTokenEvents } from "@/features/auth/hooks";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

export const RequestActivationLinkForm = () => {
    const t = useTranslate();
    const { control, handleSubmit } = useRequestAccountActivationLinkForm();
    const { mutateAsync, isPending, isSuccess } = useRequestAccountActivationToken();
    const { onRequestActivationError, onRequestActivationSuccess } = useRequestAccountActivationTokenEvents();

    const internalOnSubmit = useCallback(
        async ({ email }: RequestAccountActivationFormInputs) => {
            try {
                await mutateAsync({ email: email.trim() });
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
                    name="email"
                    control={control}
                    autoComplete="email"
                    size="3"
                    required
                />
            </div>

            <Button type="submit" isLoading={isPending} isDisabled={isSuccess} size="3">
                {t("authentication.accountActivation.form.submitButton")}
            </Button>
        </form>
    );
};
