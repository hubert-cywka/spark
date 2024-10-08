import { FormProvider } from "react-hook-form";

import { Anchor } from "@/components/anchor/Anchor";
import { Button } from "@/components/button/Button";
import { Checkbox } from "@/components/checkbox/Checkbox";
import { Field } from "@/components/input/Field";
import { RegisterFormInputs, useRegisterForm } from "@/features/auth/components/registerForm/hooks/useRegisterForm";
import { RegisterFormStyled } from "@/features/auth/components/registerForm/styles/RegisterForm.styled";
import { AuthenticationFormStyled } from "@/features/auth/styles/AuthenticationForm.styled";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { FormProps } from "@/types/Form";

type RegisterFormProps = {
    onLoginLinkClick: () => void;
} & FormProps<RegisterFormInputs>;

// TODO: Finish T&C
export const RegisterForm = ({ onSubmit, onLoginLinkClick, isLoading, isDisabled }: RegisterFormProps) => {
    const t = useTranslate();
    const form = useRegisterForm();
    const { handleSubmit, control } = form;

    return (
        <FormProvider {...form}>
            <AuthenticationFormStyled.Form onSubmit={handleSubmit(onSubmit)}>
                <AuthenticationFormStyled.Header>{t("authentication.registration.form.header")}</AuthenticationFormStyled.Header>
                <AuthenticationFormStyled.Caption>
                    {t("authentication.registration.form.alreadyRegistered.caption")}{" "}
                    <Anchor onPress={onLoginLinkClick}>{t("authentication.registration.form.alreadyRegistered.link")}</Anchor>
                </AuthenticationFormStyled.Caption>

                <AuthenticationFormStyled.FieldsWrapper>
                    <RegisterFormStyled.NameWrapper>
                        <Field
                            label={t("authentication.common.fields.firstName.label")}
                            name="firstName"
                            control={control}
                            size="3"
                            required
                        />
                        <Field
                            label={t("authentication.common.fields.lastName.label")}
                            name="lastName"
                            control={control}
                            size="3"
                            required
                        />
                    </RegisterFormStyled.NameWrapper>

                    <Field<RegisterFormInputs>
                        label={t("authentication.common.fields.email.label")}
                        autoComplete="email"
                        name="email"
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
                    <Field
                        label={t("authentication.common.fields.confirmPassword.label")}
                        name="confirmPassword"
                        type="password"
                        control={control}
                        autoComplete="hidden"
                        size="3"
                        required
                    />

                    <RegisterFormStyled.AgreementsWrapper>
                        <Checkbox name="hasAcceptedTermsAndConditions" control={control} required>
                            {t("authentication.common.fields.termsAndConditions.label")}
                        </Checkbox>
                    </RegisterFormStyled.AgreementsWrapper>
                </AuthenticationFormStyled.FieldsWrapper>

                <Button isLoading={isLoading} isDisabled={isDisabled} size="3" type="submit">
                    {t("authentication.registration.form.submitButton")}
                </Button>
            </AuthenticationFormStyled.Form>
        </FormProvider>
    );
};
