import { useCallback } from "react";

import sharedStyles from "../../styles/AuthenticationForm.module.scss";

import { AppRoute } from "@/app/appRoute";
import { Anchor } from "@/components/anchor/Anchor";
import { Button } from "@/components/button/Button";
import { Field } from "@/components/input/Field";
import { ResetPasswordFormInputs, useResetPasswordForm } from "@/features/auth/components/resetPasswordForm/hooks/useResetPasswordForm";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { FormProps } from "@/types/Form";

type ResetPasswordFormProps = FormProps<ResetPasswordFormInputs>;

export const ResetPasswordForm = ({ onSubmit, isLoading, isDisabled }: ResetPasswordFormProps) => {
    const t = useTranslate();
    const { control, handleSubmit } = useResetPasswordForm();

    const internalOnSubmit = useCallback(
        (inputs: ResetPasswordFormInputs) => {
            onSubmit({ email: inputs.email.trim() });
        },
        [onSubmit]
    );

    return (
        <form className={sharedStyles.form} onSubmit={handleSubmit(internalOnSubmit)}>
            <h1 className={sharedStyles.header}>{t("authentication.requestPasswordReset.form.header")}</h1>
            <p className={sharedStyles.caption}>{t("authentication.requestPasswordReset.form.caption")}</p>
            <p className={sharedStyles.caption}>
                <Anchor href={AppRoute.LOGIN}>{t("authentication.requestPasswordReset.form.logInLink")}</Anchor>
            </p>

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

            <Button isLoading={isLoading} isDisabled={isDisabled} size="3" type="submit">
                {t("authentication.requestPasswordReset.form.submitButton")}
            </Button>
        </form>
    );
};
