"use client";

import { useCallback } from "react";

import { RegisterFormInputs, useRegisterForm } from "./hooks/useRegisterForm";

import sharedStyles from "../../styles/AuthenticationForm.module.scss";
import styles from "./styles/RegisterForm.module.scss";

import { AppRoute } from "@/app/appRoute";
import { Anchor } from "@/components/Anchor";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { Field } from "@/components/Input";
import { useRegisterWithCredentials, useRegisterWithCredentialsEvents } from "@/features/auth/hooks";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { getAbsoluteAppUrl } from "@/utils/appUrl";
import { preventEventBubbling } from "@/utils/domEventsUtils.ts";

export const RegisterForm = () => {
    const t = useTranslate();

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useRegisterForm();
    const { mutateAsync: requestRegistration, isPending, isSuccess } = useRegisterWithCredentials();
    const { onRegisterError, onRegisterSuccess } = useRegisterWithCredentialsEvents();

    const onSubmit = useCallback(
        async (inputs: RegisterFormInputs) => {
            try {
                await requestRegistration({
                    ...inputs,
                    email: inputs.email.trim(),
                    accountActivationRedirectUrl: getAbsoluteAppUrl(AppRoute.ACTIVATE_ACCOUNT),
                });
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
                <Field
                    label={t("authentication.common.fields.email.label")}
                    autoComplete="email"
                    size="3"
                    required
                    {...register("email")}
                    error={errors.email?.message}
                />
                <Field
                    label={t("authentication.common.fields.password.label")}
                    type="password"
                    autoComplete="hidden"
                    size="3"
                    required
                    {...register("password")}
                    error={errors.password?.message}
                />
                <Field
                    label={t("authentication.common.fields.confirmPassword.label")}
                    type="password"
                    autoComplete="hidden"
                    size="3"
                    required
                    {...register("confirmPassword")}
                    error={errors.confirmPassword?.message}
                />

                <div className={styles.agreementsWrapper}>
                    <Checkbox {...register("hasAcceptedTermsAndConditions")} required error={errors.hasAcceptedTermsAndConditions?.message}>
                        {t("authentication.common.fields.termsAndConditions.label")}{" "}
                        <Anchor href={AppRoute.TERMS_AND_CONDITIONS} target="_blank" onClick={preventEventBubbling}>
                            {t("authentication.common.fields.termsAndConditions.link")}
                        </Anchor>
                    </Checkbox>
                </div>
            </div>

            <Button isLoading={isPending} isDisabled={isSuccess} size="3" type="submit">
                {t("authentication.registration.form.submitButton")}
            </Button>
        </form>
    );
};
