import { FormProvider } from "react-hook-form";

import { Anchor } from "@/components/anchor/Anchor";
import { Button } from "@/components/button/Button";
import { Checkbox } from "@/components/checkbox/Checkbox";
import { Field } from "@/components/input/Field";
import { RegisterFormInputs, useRegisterForm } from "@/features/auth/components/registerForm/hooks/useRegisterForm";
import { RegisterFormStyled } from "@/features/auth/components/registerForm/styles/RegisterForm.styled";
import { AuthenticationFormStyled } from "@/features/auth/styles/AuthenticationForm.styled";

type RegisterFormProps = {
    onSubmit: (data: RegisterFormInputs) => void;
    onLoginLinkClick: () => void;
    isLoading?: boolean;
};

// TODO: Finish T&C
export const RegisterForm = ({ onSubmit, onLoginLinkClick, isLoading }: RegisterFormProps) => {
    const form = useRegisterForm();
    const { handleSubmit, control } = form;

    return (
        <FormProvider {...form}>
            <AuthenticationFormStyled.Form onSubmit={handleSubmit(onSubmit)}>
                <AuthenticationFormStyled.Header>Create an account</AuthenticationFormStyled.Header>
                <AuthenticationFormStyled.Caption>
                    Already have one? <Anchor onPress={onLoginLinkClick}>Log in</Anchor>
                </AuthenticationFormStyled.Caption>

                <AuthenticationFormStyled.FieldsWrapper>
                    <RegisterFormStyled.NameWrapper>
                        <Field label="First name" name="firstName" control={control} size="3" required />
                        <Field label="Last name" name="lastName" control={control} size="3" required />
                    </RegisterFormStyled.NameWrapper>

                    <RegisterFormStyled.NameWrapper>
                        <Field label="First name" name="firstName" control={control} size="3" required />
                        <Field label="Last name" name="lastName" control={control} size="3" required />
                    </RegisterFormStyled.NameWrapper>

                    <Field<RegisterFormInputs>
                        label="Email"
                        autoComplete="email"
                        name="email"
                        control={control}
                        size="3"
                        required
                    />
                    <Field label="Password" name="password" autoComplete="hidden" control={control} size="3" required />
                    <Field
                        label="Confirm password"
                        name="confirmPassword"
                        control={control}
                        autoComplete="hidden"
                        size="3"
                        required
                    />

                    <RegisterFormStyled.AgreementsWrapper>
                        <Checkbox name="termsAndConditions" control={control} required>
                            I agree to Terms & Conditions.
                        </Checkbox>
                    </RegisterFormStyled.AgreementsWrapper>
                </AuthenticationFormStyled.FieldsWrapper>

                <Button isLoading={isLoading} size="3" type="submit">
                    Sign up
                </Button>
            </AuthenticationFormStyled.Form>
        </FormProvider>
    );
};
