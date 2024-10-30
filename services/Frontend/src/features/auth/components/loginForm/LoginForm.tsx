"use client";

import { PropsWithChildren, useCallback } from "react";

import sharedStyles from "../../styles/AuthenticationForm.module.scss";

import { Button } from "@/components/button/Button";
import { Field } from "@/components/input/Field";
import { LoginFormInputs, useLoginForm } from "@/features/auth/components/loginForm/hooks/useLoginForm";
import { useLoginFormEvents } from "@/features/auth/components/loginForm/hooks/useLoginFormEvents";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

type LoginFormProps = PropsWithChildren;

export const LoginForm = ({ children }: LoginFormProps) => {
    const t = useTranslate();
    const { handleSubmit, control } = useLoginForm();
    const { mutateAsync: login, isPending, isSuccess } = useLogin();
    const { onLoginError, onLoginSuccess } = useLoginFormEvents();

    const internalOnSubmit = useCallback(
        async (inputs: LoginFormInputs) => {
            try {
                await login({ ...inputs, email: inputs.email.trim() });
                onLoginSuccess();
            } catch (e) {
                onLoginError(e);
            }
        },
        [login, onLoginError, onLoginSuccess]
    );

    return (
        <form className={sharedStyles.form} onSubmit={handleSubmit(internalOnSubmit)}>
            <div className={sharedStyles.fieldsWrapper}>
                <Field
                    label={t("authentication.common.fields.email.label")}
                    name="email"
                    autoComplete="email"
                    control={control}
                    size="3"
                    required
                />
                <Field
                    label={t("authentication.common.fields.password.label")}
                    name="password"
                    type="password"
                    autoComplete="hidden"
                    control={control}
                    size="3"
                    required
                />
                {children}
            </div>

            <Button isLoading={isPending} size="3" type="submit" isDisabled={isSuccess}>
                {t("authentication.login.form.submitButton")}
            </Button>
        </form>
    );
};
