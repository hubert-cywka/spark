import { Anchor } from "@/components/anchor/Anchor";
import { Button } from "@/components/button/Button";
import { Field } from "@/components/input/Field";
import { UpdatePasswordFormInputs, useUpdatePasswordForm } from "@/features/auth/components/updatePasswordForm/hooks/useUpdatePasswordForm";
import { AuthenticationFormStyled } from "@/features/auth/styles/AuthenticationForm.styled";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { FormProps } from "@/types/Form";

type UpdatePasswordFormProps = {
    onLogInLinkClick: () => void;
} & FormProps<UpdatePasswordFormInputs>;

export const UpdatePasswordForm = ({ isLoading, onSubmit, onLogInLinkClick, isDisabled }: UpdatePasswordFormProps) => {
    const t = useTranslate();
    const { handleSubmit, control } = useUpdatePasswordForm();

    return (
        <AuthenticationFormStyled.Form onSubmit={handleSubmit(onSubmit)}>
            <AuthenticationFormStyled.Header>{t("authentication.passwordReset.form.header")}</AuthenticationFormStyled.Header>
            <AuthenticationFormStyled.Caption>{t("authentication.passwordReset.form.caption")}</AuthenticationFormStyled.Caption>
            <AuthenticationFormStyled.Caption>
                {t("authentication.passwordReset.form.logInLink.link")}{" "}
                <Anchor onPress={onLogInLinkClick}>{t("authentication.passwordReset.form.logInLink.link")}</Anchor>
            </AuthenticationFormStyled.Caption>

            <AuthenticationFormStyled.FieldsWrapper>
                <Field
                    label={t("authentication.common.fields.password.label")}
                    name="password"
                    type="password"
                    control={control}
                    size="3"
                    required
                />
                <Field
                    label={t("authentication.common.fields.confirmPassword.label")}
                    name="confirmPassword"
                    type="password"
                    control={control}
                    size="3"
                    required
                />
            </AuthenticationFormStyled.FieldsWrapper>

            <Button isLoading={isLoading} isDisabled={isDisabled} size="3" type="submit">
                {t("authentication.passwordReset.form.submitButton")}
            </Button>
        </AuthenticationFormStyled.Form>
    );
};
