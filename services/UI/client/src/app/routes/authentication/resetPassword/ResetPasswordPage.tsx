import { useNavigate } from "react-router";

import { AppRoute } from "@/app/routes/appRoute";
import { AuthenticationPageStyled } from "@/app/routes/authentication/shared/styles/AuthenticationPage.styled";
import { Alert } from "@/components/alert/Alert";
import { Anchor } from "@/components/anchor/Anchor";
import { Card } from "@/components/card/Card";
import { Page } from "@/components/page/Page";
import { ResetPasswordFormInputs } from "@/features/auth/components/resetPasswordForm/hooks/useResetPasswordForm";
import { ResetPasswordForm } from "@/features/auth/components/resetPasswordForm/ResetPasswordForm";
import { UpdatePasswordFormInputs } from "@/features/auth/components/updatePasswordForm/hooks/useUpdatePasswordForm";
import { UpdatePasswordForm } from "@/features/auth/components/updatePasswordForm/UpdatePasswordForm";
import { usePasswordReset } from "@/features/auth/hooks/usePasswordReset";
import { logger } from "@/lib/logger/logger";

export const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const { passwordResetToken, requestPasswordReset, updatePassword } = usePasswordReset();

    const {
        mutateAsync: requestPasswordResetLinkMutation,
        isPending: isRequestingPasswordResetLink,
        error: passwordResetRequestError,
        isSuccess: hasSentPasswordResetLink,
    } = requestPasswordReset;

    const {
        mutateAsync: updatePasswordMutation,
        isPending: isUpdatingPassword,
        error: passwordUpdateError,
        isSuccess: hasUpdatedPassword,
    } = updatePassword;

    const onResetPasswordFormSubmit = async (payload: ResetPasswordFormInputs) => {
        try {
            await requestPasswordResetLinkMutation(payload);
        } catch (err) {
            logger.error(err);
        }
    };

    const onUpdatePasswordFormSubmit = async (payload: UpdatePasswordFormInputs) => {
        try {
            await updatePasswordMutation(payload);
        } catch (err) {
            logger.error(err);
        }
    };

    const navigateToLoginPage = () => {
        navigate(AppRoute.LOGIN);
    };

    return (
        <Page>
            <AuthenticationPageStyled.ContentWrapper>
                <Card>
                    {!passwordResetToken ? (
                        <ResetPasswordForm
                            onSubmit={onResetPasswordFormSubmit}
                            onLogInLinkClick={navigateToLoginPage}
                            isLoading={isRequestingPasswordResetLink}
                        />
                    ) : (
                        <UpdatePasswordForm
                            onSubmit={onUpdatePasswordFormSubmit}
                            onLogInLinkClick={navigateToLoginPage}
                            isLoading={isUpdatingPassword}
                        />
                    )}
                </Card>

                {!!passwordUpdateError && <Alert variant="danger">{passwordUpdateError.message}</Alert>}
                {hasUpdatedPassword && (
                    <Alert variant="success">
                        Password updated. You can now <Anchor onPress={navigateToLoginPage}>log in</Anchor> with your
                        new password.
                    </Alert>
                )}

                {hasSentPasswordResetLink && (
                    <Alert variant="success">Password reset link sent. Please check your mail inbox.</Alert>
                )}
                {!!passwordResetRequestError && <Alert variant="danger">{passwordResetRequestError.message}</Alert>}
            </AuthenticationPageStyled.ContentWrapper>
        </Page>
    );
};
