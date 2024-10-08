import { Anchor } from "@/components/anchor/Anchor";
import { Button } from "@/components/button/Button";
import { Field } from "@/components/input/Field";
import { LoginFormInputs, useLoginForm } from "@/features/auth/components/loginForm/hooks/useLoginForm";
import { AuthenticationFormStyled } from "@/features/auth/styles/AuthenticationForm.styled";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { FormProps } from "@/types/Form";

type LoginFormProps = {
    onRegisterLinkClick: () => void;
    onResetPasswordLinkClick: () => void;
    onRequestAccountActivationLinkClick: () => void;
} & FormProps<LoginFormInputs>;

export const LoginForm = ({
    onSubmit,
    isLoading,
    isDisabled,
    onRegisterLinkClick,
    onResetPasswordLinkClick,
    onRequestAccountActivationLinkClick,
}: LoginFormProps) => {
    const t = useTranslate();
    const { handleSubmit, control } = useLoginForm();

    return (
        <AuthenticationFormStyled.Form onSubmit={handleSubmit(onSubmit)}>
            <AuthenticationFormStyled.Header>{t("authentication.login.form.header")}</AuthenticationFormStyled.Header>
            <AuthenticationFormStyled.Caption>
                {t("authentication.login.form.noAccount.caption")}{" "}
                <Anchor onPress={onRegisterLinkClick}>{t("authentication.login.form.noAccount.link")}</Anchor>
            </AuthenticationFormStyled.Caption>
            <AuthenticationFormStyled.Caption>
                {t("authentication.login.form.accountNotActivated.caption")}{" "}
                <Anchor onPress={onRequestAccountActivationLinkClick}>{t("authentication.login.form.accountNotActivated.link")}</Anchor>
            </AuthenticationFormStyled.Caption>

            <AuthenticationFormStyled.FieldsWrapper>
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
                <Anchor onPress={onResetPasswordLinkClick}>{t("authentication.login.form.forgotPassword.link")}</Anchor>
            </AuthenticationFormStyled.FieldsWrapper>

            <Button isLoading={isLoading} size="3" type="submit" isDisabled={isDisabled}>
                {t("authentication.login.form.submitButton")}
            </Button>
        </AuthenticationFormStyled.Form>
    );
};
