import { Anchor } from "@/components/anchor/Anchor";
import { Button } from "@/components/button/Button";
import { Field } from "@/components/input/Field";
import {
    UpdatePasswordFormInputs,
    useUpdatePasswordForm,
} from "@/features/auth/components/updatePasswordForm/hooks/useUpdatePasswordForm";
import { AuthenticationFormStyled } from "@/features/auth/styles/AuthenticationForm.styled";

type UpdatePasswordFormProps = {
    onSubmit: (payload: UpdatePasswordFormInputs) => void;
    onLogInLinkClick: () => void;
    isLoading?: boolean;
};

export const UpdatePasswordForm = ({ isLoading, onSubmit, onLogInLinkClick }: UpdatePasswordFormProps) => {
    const { handleSubmit, control } = useUpdatePasswordForm();

    return (
        <AuthenticationFormStyled.Form onSubmit={handleSubmit(onSubmit)}>
            <AuthenticationFormStyled.Header>Update password</AuthenticationFormStyled.Header>
            <AuthenticationFormStyled.Caption>Please submit your new password.</AuthenticationFormStyled.Caption>
            <AuthenticationFormStyled.Caption>
                {"Don't want to change it?"} <Anchor onPress={onLogInLinkClick}>Log in</Anchor>
            </AuthenticationFormStyled.Caption>

            <AuthenticationFormStyled.FieldsWrapper>
                <Field label="Password" name="password" control={control} size="3" required />
                <Field label="Confirm password" name="confirmPassword" control={control} size="3" required />
            </AuthenticationFormStyled.FieldsWrapper>

            <Button isLoading={isLoading} size="3" type="submit">
                Update
            </Button>
        </AuthenticationFormStyled.Form>
    );
};
