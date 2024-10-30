"use client";

import { useCallback } from "react";

import sharedStyles from "../../styles/AuthenticationForm.module.scss";

import { Button } from "@/components/button/Button";
import { Field } from "@/components/input/Field";
import {
    RequestAccountActivationFormInputs,
    useRequestAccountActivationLinkForm,
} from "@/features/auth/components/requestActivationLinkForm/hooks/useRequestAccountActivationLinkForm";
import { useRequestAccountActivationLinkFormEvents } from "@/features/auth/components/requestActivationLinkForm/hooks/useRequestAccountActivationLinkFormEvents";
import { useRequestAccountActivationToken } from "@/features/auth/hooks/useRequestAccountActivationToken";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

export const RequestActivationLinkForm = () => {
    const t = useTranslate();
    const { control, handleSubmit } = useRequestAccountActivationLinkForm();
    const { mutateAsync, isPending, isSuccess } = useRequestAccountActivationToken();
    const { onRequestActivationError, onRequestActivationSuccess } = useRequestAccountActivationLinkFormEvents();

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
