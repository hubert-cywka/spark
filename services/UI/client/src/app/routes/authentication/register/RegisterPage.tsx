import { useCallback } from "react";
import { useNavigate } from "react-router";

import { AppRoute } from "@/app/routes/appRoute";
import { AuthenticationPageStyled } from "@/app/routes/authentication/shared/styles/AuthenticationPage.styled";
import { Card } from "@/components/card/Card";
import { Page } from "@/components/page/Page";
import { RegisterFormInputs } from "@/features/auth/components/registerForm/hooks/useRegisterForm";
import { RegisterForm } from "@/features/auth/components/registerForm/RegisterForm";
import { useRegister } from "@/features/auth/hooks/useRegister";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";
import { getErrorMessage } from "@/utils/getErrorMessage";

export const RegisterPage = () => {
    const { mutateAsync: register, isPending, isSuccess } = useRegister();
    const navigate = useNavigate();

    const handleRegister = useCallback(
        async (data: RegisterFormInputs) => {
            try {
                await register(data);
                navigate(AppRoute.ACTIVATE_ACCOUNT);
                showToast().success({
                    message: "Please check your mail inbox to finish registration process.",
                    title: "Account created",
                });
            } catch (err) {
                logger.error({ err });
                showToast().danger({
                    message: getErrorMessage(err),
                    title: "Registration failed",
                });
            }
        },
        [navigate, register]
    );

    const navigateToLoginPage = () => {
        navigate(AppRoute.LOGIN);
    };

    return (
        <Page>
            <AuthenticationPageStyled.ContentWrapper>
                <Card>
                    <RegisterForm
                        onSubmit={handleRegister}
                        isLoading={isPending}
                        isDisabled={isSuccess}
                        onLoginLinkClick={navigateToLoginPage}
                    />
                </Card>
            </AuthenticationPageStyled.ContentWrapper>
        </Page>
    );
};
