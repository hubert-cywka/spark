"use client";

import { useCallback } from "react";

import sharedStyles from "../../styles/AuthenticationForm.module.scss";

import { Button } from "@/components/button/Button";
import { Field } from "@/components/input/Field";
import {
    RequestAccountActivationFormInputs,
    useRequestAccountActivationLinkForm,
} from "@/features/auth/components/requestActivationLinkForm/hooks/useRequestAccountActivationLinkForm";
import { useRequestAccountActivationToken } from "@/features/auth/hooks/useRequestAccountActivationToken";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";
import { getErrorMessage } from "@/utils/getErrorMessage";

export const RequestActivationLinkForm = () => {
    const t = useTranslate();
    const { control, handleSubmit } = useRequestAccountActivationLinkForm();
    const { mutateAsync, isPending, isSuccess } = useRequestAccountActivationToken();

    const onRequestActivationSuccess = useCallback(() => {
        showToast().success({
            message: t("authentication.accountActivation.notifications.success.body"),
            title: t("authentication.accountActivation.notifications.success.title"),
        });
    }, [t]);

    const onRequestActivationError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err),
                title: t("authentication.accountActivation.notifications.error.title"),
            });
        },
        [t]
    );

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
