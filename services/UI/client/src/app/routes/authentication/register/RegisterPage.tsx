import { useCallback } from "react";
import { useNavigate } from "react-router";

import { AppRoute } from "@/app/routes/appRoute";
import { AuthenticationPageStyled } from "@/app/routes/authentication/shared/styles/AuthenticationPage.styled";
import { Alert } from "@/components/alert/Alert";
import { Card } from "@/components/card/Card";
import { Page } from "@/components/page/Page";
import { RegisterFormInputs } from "@/features/auth/components/registerForm/hooks/useRegisterForm";
import { RegisterForm } from "@/features/auth/components/registerForm/RegisterForm";
import { useRegister } from "@/features/auth/hooks/useRegister";
import { logger } from "@/lib/logger/logger";
import { wait } from "@/utils/wait";

const DELAY_BEFORE_REDIRECTION = 3000;

export const RegisterPage = () => {
    const { mutateAsync: register, isPending, error, isSuccess } = useRegister();
    const navigate = useNavigate();

    const handleRegister = useCallback(
        async (data: RegisterFormInputs) => {
            try {
                await register(data);
                await wait(DELAY_BEFORE_REDIRECTION);
                navigate(AppRoute.ACTIVATE_ACCOUNT);
            } catch (err) {
                logger.error(err);
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
                        onLoginLinkClick={navigateToLoginPage}
                    />
                </Card>
                {error && <Alert variant="danger">{error.message}</Alert>}
                {isSuccess && <Alert variant="success">Registration submitted. Please wait for redirection...</Alert>}
            </AuthenticationPageStyled.ContentWrapper>
        </Page>
    );
};
