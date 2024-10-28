import { useCallback } from "react";

import sharedStyles from "../../styles/AuthenticationForm.module.scss";

import { AppRoute } from "@/app/appRoute";
import { Anchor } from "@/components/anchor/Anchor";
import { Button } from "@/components/button/Button";
import { Field } from "@/components/input/Field";
import { LoginFormInputs, useLoginForm } from "@/features/auth/components/loginForm/hooks/useLoginForm";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { FormProps } from "@/types/Form";

type LoginFormProps = FormProps<LoginFormInputs>;

export const LoginForm = ({ onSubmit, isLoading, isDisabled }: LoginFormProps) => {
    const t = useTranslate();
    const { handleSubmit, control } = useLoginForm();

    const internalOnSubmit = useCallback(
        (inputs: LoginFormInputs) => {
            onSubmit({ ...inputs, email: inputs.email.trim() });
        },
        [onSubmit]
    );

    return (
        <form className={sharedStyles.form} onSubmit={handleSubmit(internalOnSubmit)}>
            <h1 className={sharedStyles.header}>{t("authentication.login.form.header")}</h1>
            <p className={sharedStyles.caption}>
                {t("authentication.login.form.noAccount.caption")}{" "}
                <Anchor href={AppRoute.REGISTER}>{t("authentication.login.form.noAccount.link")}</Anchor>
            </p>
            <p className={sharedStyles.caption}>
                {t("authentication.login.form.accountNotActivated.caption")}{" "}
                <Anchor href={AppRoute.ACTIVATE_ACCOUNT}>{t("authentication.login.form.accountNotActivated.link")}</Anchor>
            </p>

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
                <Anchor href={AppRoute.RESET_PASSWORD}>{t("authentication.login.form.forgotPassword.link")}</Anchor>
            </div>

            <Button isLoading={isLoading} size="3" type="submit" isDisabled={isDisabled}>
                {t("authentication.login.form.submitButton")}
            </Button>
        </form>
    );
};
