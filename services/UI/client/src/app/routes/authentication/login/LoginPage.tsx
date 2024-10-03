import { useCallback } from "react";
import { useNavigate } from "react-router";

import { AppRoute } from "@/app/routes/appRoute";
import { AuthenticationPageStyled } from "@/app/routes/authentication/shared/styles/AuthenticationPage.styled";
import { Alert } from "@/components/alert/Alert";
import { Card } from "@/components/card/Card";
import { Page } from "@/components/page/Page";
import { LoginFormInputs } from "@/features/auth/components/loginForm/hooks/useLoginForm";
import { LoginForm } from "@/features/auth/components/loginForm/LoginForm";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { logger } from "@/lib/logger/logger";

export const LoginPage = () => {
    const { mutateAsync: login, isPending, error, isSuccess } = useLogin();
    const navigate = useNavigate();

    const handleLogin = useCallback(
        async (data: LoginFormInputs) => {
            try {
                await login(data);
            } catch (err) {
                logger.error(err);
            }
        },
        [login]
    );

    const navigateToRegisterPage = () => {
        navigate(AppRoute.REGISTER);
    };

    const navigateToResetPasswordPage = () => {
        navigate(AppRoute.RESET_PASSWORD);
    };

    const navigateToAccountActivationPage = () => {
        navigate(AppRoute.ACTIVATE_ACCOUNT);
    };

    return (
        <Page>
            <AuthenticationPageStyled.ContentWrapper>
                <Card>
                    <LoginForm
                        onSubmit={handleLogin}
                        isLoading={isPending}
                        onRegisterLinkClick={navigateToRegisterPage}
                        onResetPasswordLinkClick={navigateToResetPasswordPage}
                        onRequestAccountActivationLinkClick={navigateToAccountActivationPage}
                    />
                </Card>

                {error && <Alert variant="danger">{error?.message}</Alert>}
                {isSuccess && (
                    <Alert variant="success">{"You've been logged in. Please wait for redirection..."}</Alert>
                )}
            </AuthenticationPageStyled.ContentWrapper>
        </Page>
    );
};
