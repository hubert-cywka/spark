import { Anchor } from "@/components/anchor/Anchor";
import { Button } from "@/components/button/Button";
import { Field } from "@/components/input/Field";
import { UpdatePasswordFormInputs, useUpdatePasswordForm } from "@/features/auth/components/updatePasswordForm/hooks/useUpdatePasswordForm";
import { AuthenticationFormStyled } from "@/features/auth/styles/AuthenticationForm.styled";
import { FormProps } from "@/types/Form";

type UpdatePasswordFormProps = {
    onLogInLinkClick: () => void;
} & FormProps<UpdatePasswordFormInputs>;

export const UpdatePasswordForm = ({ isLoading, onSubmit, onLogInLinkClick, isDisabled }: UpdatePasswordFormProps) => {
    const { handleSubmit, control } = useUpdatePasswordForm();

    return (
        <AuthenticationFormStyled.Form onSubmit={handleSubmit(onSubmit)}>
            <AuthenticationFormStyled.Header>Update password</AuthenticationFormStyled.Header>
            <AuthenticationFormStyled.Caption>Please submit your new password.</AuthenticationFormStyled.Caption>
            <AuthenticationFormStyled.Caption>
                {"Don't want to change it?"} <Anchor onPress={onLogInLinkClick}>Log in</Anchor>
            </AuthenticationFormStyled.Caption>

            <AuthenticationFormStyled.FieldsWrapper>
                <Field label="Password" name="password" type="password" control={control} size="3" required />
                <Field label="Confirm password" name="confirmPassword" type="password" control={control} size="3" required />
            </AuthenticationFormStyled.FieldsWrapper>

            <Button isLoading={isLoading} isDisabled={isDisabled} size="3" type="submit">
                Update
            </Button>
        </AuthenticationFormStyled.Form>
    );
};
