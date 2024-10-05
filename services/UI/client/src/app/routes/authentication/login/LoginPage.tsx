import { useCallback } from "react";
import { useNavigate } from "react-router";

import { AppRoute } from "@/app/routes/appRoute";
import { AuthenticationPageStyled } from "@/app/routes/authentication/shared/styles/AuthenticationPage.styled";
import { Card } from "@/components/card/Card";
import { Page } from "@/components/page/Page";
import { LoginFormInputs } from "@/features/auth/components/loginForm/hooks/useLoginForm";
import { LoginForm } from "@/features/auth/components/loginForm/LoginForm";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";
import { getErrorMessage } from "@/utils/getErrorMessage";

export const LoginPage = () => {
    const { mutateAsync: login, isPending, isSuccess } = useLogin();
    const navigate = useNavigate();

    const handleLogin = useCallback(
        async (data: LoginFormInputs) => {
            try {
                await login(data);
                showToast().success({
                    message: "Welcome back!",
                    title: "Authentication successful",
                });
            } catch (err) {
                logger.error({ err });
                showToast().danger({
                    message: getErrorMessage(err),
                    title: "Authentication failed",
                });
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
                        isDisabled={isSuccess}
                        onRegisterLinkClick={navigateToRegisterPage}
                        onResetPasswordLinkClick={navigateToResetPasswordPage}
                        onRequestAccountActivationLinkClick={navigateToAccountActivationPage}
                    />
                </Card>
            </AuthenticationPageStyled.ContentWrapper>
        </Page>
    );
};
