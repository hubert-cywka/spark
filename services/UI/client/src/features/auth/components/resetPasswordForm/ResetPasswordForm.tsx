import { Anchor } from "@/components/anchor/Anchor";
import { Button } from "@/components/button/Button";
import { Field } from "@/components/input/Field";
import {
    ResetPasswordFormInputs,
    useResetPasswordForm,
} from "@/features/auth/components/resetPasswordForm/hooks/useResetPasswordForm";
import { AuthenticationFormStyled } from "@/features/auth/styles/AuthenticationForm.styled";

type ResetPasswordFormProps = {
    onSubmit: (data: ResetPasswordFormInputs) => void;
    onLogInLinkClick: () => void;
    isLoading?: boolean;
};

export const ResetPasswordForm = ({ onSubmit, isLoading, onLogInLinkClick }: ResetPasswordFormProps) => {
    const { control, handleSubmit } = useResetPasswordForm();

    return (
        <AuthenticationFormStyled.Form onSubmit={handleSubmit(onSubmit)}>
            <AuthenticationFormStyled.Header>Reset password</AuthenticationFormStyled.Header>
            <AuthenticationFormStyled.Caption>
                Enter your email, we will send you a link to update your password.
            </AuthenticationFormStyled.Caption>
            <AuthenticationFormStyled.Caption>
                <Anchor onPress={onLogInLinkClick}>Log in</Anchor> instead.
            </AuthenticationFormStyled.Caption>

            <AuthenticationFormStyled.FieldsWrapper>
                <Field label="Email" name="email" control={control} autoComplete="email" size="3" required />
            </AuthenticationFormStyled.FieldsWrapper>

            <Button isLoading={isLoading} size="3" type="submit">
                Send
            </Button>
        </AuthenticationFormStyled.Form>
    );
};
