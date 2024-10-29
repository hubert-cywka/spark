import { PropsWithChildren, useCallback } from "react";

import sharedStyles from "../../styles/AuthenticationForm.module.scss";

import { Button } from "@/components/button/Button";
import { Field } from "@/components/input/Field";
import { LoginFormInputs, useLoginForm } from "@/features/auth/components/loginForm/hooks/useLoginForm";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { FormProps } from "@/types/Form";

type LoginFormProps = PropsWithChildren<FormProps<LoginFormInputs>>;

export const LoginForm = ({ onSubmit, isLoading, isDisabled, children }: LoginFormProps) => {
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

            <Button isLoading={isLoading} size="3" type="submit" isDisabled={isDisabled}>
                {t("authentication.login.form.submitButton")}
            </Button>
        </form>
    );
};
