import { Anchor } from "@/components/anchor/Anchor";
import { Button } from "@/components/button/Button";
import { Field } from "@/components/input/Field";
import { LoginFormInputs, useLoginForm } from "@/features/auth/components/loginForm/hooks/useLoginForm";
import { LoginFormStyled } from "@/features/auth/components/loginForm/styles/LoginForm.styled";
import { AuthenticationFormStyled } from "@/features/auth/styles/AuthenticationForm.styled";
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
    const { handleSubmit, control } = useLoginForm();

    return (
        <AuthenticationFormStyled.Form onSubmit={handleSubmit(onSubmit)}>
            <AuthenticationFormStyled.Header>Log in</AuthenticationFormStyled.Header>
            <AuthenticationFormStyled.Caption>
                {"Don't have an account?"} <Anchor onPress={onRegisterLinkClick}>Create one</Anchor>
            </AuthenticationFormStyled.Caption>

            <AuthenticationFormStyled.FieldsWrapper>
                <Field label="Email" name="email" autoComplete="email" control={control} size="3" required />
                <Field label="Password" name="password" type="password" autoComplete="hidden" control={control} size="3" required />
                <LoginFormStyled.Link onPress={onResetPasswordLinkClick}>Forgot password?</LoginFormStyled.Link>
                <LoginFormStyled.Link onPress={onRequestAccountActivationLinkClick}>Account not activated?</LoginFormStyled.Link>
            </AuthenticationFormStyled.FieldsWrapper>

            <Button isLoading={isLoading} size="3" type="submit" isDisabled={isDisabled}>
                Sign in
            </Button>
        </AuthenticationFormStyled.Form>
    );
};
