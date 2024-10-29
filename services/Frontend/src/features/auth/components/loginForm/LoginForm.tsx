"use client";

import { PropsWithChildren, useCallback } from "react";

import sharedStyles from "../../styles/AuthenticationForm.module.scss";

import { Button } from "@/components/button/Button";
import { Field } from "@/components/input/Field";
import { LoginFormInputs, useLoginForm } from "@/features/auth/components/loginForm/hooks/useLoginForm";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";
import { getErrorMessage } from "@/utils/getErrorMessage";

type LoginFormProps = PropsWithChildren;

export const LoginForm = ({ children }: LoginFormProps) => {
    const t = useTranslate();
    const { handleSubmit, control } = useLoginForm();
    const { mutateAsync: login, isPending, isSuccess } = useLogin();

    const onLoginSuccess = useCallback(() => {
        showToast().success({
            message: t("authentication.login.notifications.success.body"),
            title: t("authentication.login.notifications.success.title"),
        });
    }, [t]);

    const onLoginError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err),
                title: t("authentication.login.notifications.error.title"),
            });
        },
        [t]
    );

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
