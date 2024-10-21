import { useCallback } from "react";

import { Anchor } from "@/components/anchor/Anchor";
import { Button } from "@/components/button/Button";
import { Field } from "@/components/input/Field";
import { ResetPasswordFormInputs, useResetPasswordForm } from "@/features/auth/components/resetPasswordForm/hooks/useResetPasswordForm";
import { AuthenticationFormStyled } from "@/features/auth/styles/AuthenticationForm.styled";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { FormProps } from "@/types/Form";

type ResetPasswordFormProps = {
    onLogInLinkClick: () => void;
} & FormProps<ResetPasswordFormInputs>;

export const ResetPasswordForm = ({ onSubmit, isLoading, onLogInLinkClick, isDisabled }: ResetPasswordFormProps) => {
    const t = useTranslate();
    const { control, handleSubmit } = useResetPasswordForm();

    const internalOnSubmit = useCallback(
        (inputs: ResetPasswordFormInputs) => {
            onSubmit({ email: inputs.email.trim() });
        },
        [onSubmit]
    );

    return (
        <AuthenticationFormStyled.Form onSubmit={handleSubmit(internalOnSubmit)}>
            <AuthenticationFormStyled.Header>{t("authentication.requestPasswordReset.form.header")}</AuthenticationFormStyled.Header>
            <AuthenticationFormStyled.Caption>{t("authentication.requestPasswordReset.form.caption")}</AuthenticationFormStyled.Caption>
            <AuthenticationFormStyled.Caption>
                <Anchor onPress={onLogInLinkClick}>{t("authentication.requestPasswordReset.form.logInLink")}</Anchor>
            </AuthenticationFormStyled.Caption>

            <AuthenticationFormStyled.FieldsWrapper>
                <Field
                    label={t("authentication.common.fields.email.label")}
                    name="email"
                    control={control}
                    autoComplete="email"
                    size="3"
                    required
                />
            </AuthenticationFormStyled.FieldsWrapper>

            <Button isLoading={isLoading} isDisabled={isDisabled} size="3" type="submit">
                {t("authentication.requestPasswordReset.form.submitButton")}
            </Button>
        </AuthenticationFormStyled.Form>
    );
};
