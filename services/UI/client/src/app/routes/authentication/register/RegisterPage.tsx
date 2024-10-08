import { useNavigate } from "react-router";

import { AppRoute } from "@/app/routes/appRoute";
import { AuthenticationPageStyled } from "@/app/routes/authentication/shared/styles/AuthenticationPage.styled";
import { Card } from "@/components/card/Card";
import { Page } from "@/components/page/Page";
import { RegisterFormInputs } from "@/features/auth/components/registerForm/hooks/useRegisterForm";
import { RegisterForm } from "@/features/auth/components/registerForm/RegisterForm";
import { useRegister } from "@/features/auth/hooks/useRegister";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";
import { getErrorMessage } from "@/utils/getErrorMessage";

export const RegisterPage = () => {
    const t = useTranslate();
    const { mutateAsync: register, isPending, isSuccess } = useRegister();
    const navigate = useNavigate();

    const onRegisterFormSubmitted = async (data: RegisterFormInputs) => {
        try {
            await register(data);
            navigate(AppRoute.ACTIVATE_ACCOUNT);
            showToast().success({
                message: t("authentication.registration.notifications.success.body"),
                title: t("authentication.registration.notifications.success.title"),
            });
        } catch (err) {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err),
                title: t("authentication.registration.notifications.error.title"),
            });
        }
    };

    const navigateToLoginPage = () => {
        navigate(AppRoute.LOGIN);
    };

    return (
        <Page>
            <AuthenticationPageStyled.ContentWrapper>
                <Card>
                    <RegisterForm
                        onSubmit={onRegisterFormSubmitted}
                        isLoading={isPending}
                        isDisabled={isSuccess}
                        onLoginLinkClick={navigateToLoginPage}
                    />
                </Card>
            </AuthenticationPageStyled.ContentWrapper>
        </Page>
    );
};
