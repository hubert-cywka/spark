import { Button } from "@/components/button/Button";
import { Field } from "@/components/input/Field";
import {
    RequestAccountActivationFormInputs,
    useRequestAccountActivationLinkForm,
} from "@/features/auth/components/requestActivationLinkForm/hooks/useRequestAccountActivationLinkForm";
import { AuthenticationFormStyled } from "@/features/auth/styles/AuthenticationForm.styled";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { FormProps } from "@/types/Form";

type RequestActivationLinkFormProps = FormProps<RequestAccountActivationFormInputs>;

export const RequestActivationLinkForm = ({ onSubmit, isLoading, isDisabled }: RequestActivationLinkFormProps) => {
    const t = useTranslate();
    const { control, handleSubmit } = useRequestAccountActivationLinkForm();

    return (
        <AuthenticationFormStyled.Form onSubmit={handleSubmit(onSubmit)}>
            <AuthenticationFormStyled.Header>{t("authentication.accountActivation.form.header")}</AuthenticationFormStyled.Header>
            <AuthenticationFormStyled.Caption>{t("authentication.accountActivation.form.caption")}</AuthenticationFormStyled.Caption>
            <AuthenticationFormStyled.Caption>{t("authentication.accountActivation.form.warning")}</AuthenticationFormStyled.Caption>

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

            <Button type="submit" isLoading={isLoading} isDisabled={isDisabled} size="3">
                {t("authentication.accountActivation.form.submitButton")}
            </Button>
        </AuthenticationFormStyled.Form>
    );
};
