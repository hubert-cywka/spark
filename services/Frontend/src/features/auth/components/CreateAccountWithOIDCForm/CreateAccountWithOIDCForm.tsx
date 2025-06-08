"use client";

import { useCallback } from "react";

import sharedStyles from "../../styles/AuthenticationForm.module.scss";

import { AppRoute } from "@/app/appRoute.ts";
import { Anchor } from "@/components/Anchor";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import {
    CreateAccountWithOIDCFormInputs,
    useCreateAccountWithOIDCForm,
} from "@/features/auth/components/CreateAccountWithOIDCForm/hooks/useCreateAccountWithOIDCForm";
import { useCreateAccountWithOIDC } from "@/features/auth/hooks/oidc/useCreateAccountWithOIDC";
import { useCreateAccountWithOIDCEvents } from "@/features/auth/hooks/oidc/useCreateAccountWithOIDCEvents";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { preventEventBubbling } from "@/utils/domEventsUtils.ts";

export const CreateAccountWithOIDCForm = () => {
    const t = useTranslate();

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useCreateAccountWithOIDCForm();
    const { mutateAsync: requestRegistration, isPending, isSuccess } = useCreateAccountWithOIDC();
    const { onRegisterError, onRegisterSuccess } = useCreateAccountWithOIDCEvents();

    const onSubmit = useCallback(
        async (inputs: CreateAccountWithOIDCFormInputs) => {
            try {
                await requestRegistration(inputs);
                onRegisterSuccess();
            } catch (err) {
                onRegisterError(err);
            }
        },
        [onRegisterError, onRegisterSuccess, requestRegistration]
    );

    return (
        <form className={sharedStyles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={sharedStyles.fieldsWrapper}>
                <Checkbox {...register("hasAcceptedTermsAndConditions")} error={errors.hasAcceptedTermsAndConditions?.message}>
                    {t("authentication.common.fields.termsAndConditions.label")}{" "}
                    <Anchor href={AppRoute.TERMS_AND_CONDITIONS} target="_blank" onClick={preventEventBubbling}>
                        {t("authentication.common.fields.termsAndConditions.link")}
                    </Anchor>
                </Checkbox>
            </div>

            <Button isLoading={isPending} isDisabled={isSuccess} size="3" type="submit">
                {t("authentication.oidc.register.form.button.label")}
            </Button>
        </form>
    );
};
