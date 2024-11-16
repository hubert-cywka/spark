"use client";

import { useCallback } from "react";

import sharedStyles from "../../styles/AuthenticationForm.module.scss";

import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import {
    CreateAccountWithOIDCFormInputs,
    useCreateAccountWithOIDCForm,
} from "@/features/auth/components/CreateAccountWithOIDCForm/hooks/useCreateAccountWithOIDCForm";
import { useCreateAccountWithOIDC } from "@/features/auth/hooks/oidc/useCreateAccountWithOIDC";
import { useCreateAccountWithOIDCEvents } from "@/features/auth/hooks/oidc/useCreateAccountWithOIDCEvents";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

// TODO: Finish T&C
export const CreateAccountWithOIDCForm = () => {
    const t = useTranslate();

    const { handleSubmit, control } = useCreateAccountWithOIDCForm();
    const { mutateAsync: register, isPending, isSuccess } = useCreateAccountWithOIDC();
    const { onRegisterError, onRegisterSuccess } = useCreateAccountWithOIDCEvents();

    const onSubmit = useCallback(
        async (inputs: CreateAccountWithOIDCFormInputs) => {
            try {
                await register(inputs);
                onRegisterSuccess();
            } catch (err) {
                onRegisterError(err);
            }
        },
        [onRegisterError, onRegisterSuccess, register]
    );

    return (
        <form className={sharedStyles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={sharedStyles.fieldsWrapper}>
                <Checkbox name="hasAcceptedTermsAndConditions" control={control} required>
                    {t("authentication.common.fields.termsAndConditions.label")}
                </Checkbox>
            </div>

            <Button isLoading={isPending} isDisabled={isSuccess} size="3" type="submit">
                {t("authentication.oidc.register.form.button.label")}
            </Button>
        </form>
    );
};
