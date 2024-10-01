import { Anchor } from "@/components/anchor/Anchor";
import { Field } from "@/components/input/Field";
import { LoginFormInputs, useLoginForm } from "@/features/auth/components/loginForm/hooks/useLoginForm";
import { LoginFormStyled } from "@/features/auth/components/loginForm/styles/LoginForm.styled";

type LoginFormProps = {
    onSubmit: (data: LoginFormInputs) => void;
    isLoading?: boolean;
};

// TODO: Handle navigation to register and reset password pages
export const LoginForm = ({ onSubmit, isLoading }: LoginFormProps) => {
    const { fields, handleSubmit } = useLoginForm();

    return (
        <LoginFormStyled.Form onSubmit={handleSubmit(onSubmit)}>
            <LoginFormStyled.Header>Sign in</LoginFormStyled.Header>
            <Field label="Email" inputProps={{ ...fields.email(), width: 300, size: "3" }} isRequired />
            <Field label="Password" inputProps={{ ...fields.password(), width: 300, size: "3" }} isRequired />
            <LoginFormStyled.ResetPasswordLink>Forgot password?</LoginFormStyled.ResetPasswordLink>

            <LoginFormStyled.Button isLoading={isLoading} size="3" type="submit">
                Sign in
            </LoginFormStyled.Button>
            <Anchor>Create an account.</Anchor>
        </LoginFormStyled.Form>
    );
};
