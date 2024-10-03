import { Button } from "@/components/button/Button";
import { Field } from "@/components/input/Field";
import {
    RequestAccountActivationFormInputs,
    useRequestAccountActivationLinkForm,
} from "@/features/auth/components/requestActivationLinkForm/hooks/useRequestAccountActivationLinkForm";
import { AuthenticationFormStyled } from "@/features/auth/styles/AuthenticationForm.styled";

type RequestActivationLinkFormProps = {
    onSubmit: (payload: RequestAccountActivationFormInputs) => void;
    isLoading?: boolean;
};

export const RequestActivationLinkForm = ({ onSubmit, isLoading }: RequestActivationLinkFormProps) => {
    const { control, handleSubmit } = useRequestAccountActivationLinkForm();

    return (
        <AuthenticationFormStyled.Form onSubmit={handleSubmit(onSubmit)}>
            <AuthenticationFormStyled.Header>Need another link?</AuthenticationFormStyled.Header>
            <AuthenticationFormStyled.Caption>
                {
                    "Please submit your email, we will send the activation link once again. Previous one will be invalidated and won't work anymore."
                }
            </AuthenticationFormStyled.Caption>
            <AuthenticationFormStyled.Caption>
                You<b> {"won't"}</b> receive the activation link if your account is <b>already activated</b>.
            </AuthenticationFormStyled.Caption>

            <AuthenticationFormStyled.FieldsWrapper>
                <Field label="Email" name="email" control={control} autoComplete="email" size="3" required />
            </AuthenticationFormStyled.FieldsWrapper>

            <Button type="submit" isLoading={isLoading} size="3">
                Send
            </Button>
        </AuthenticationFormStyled.Form>
    );
};
