import { useEffect } from "react";
import { useNavigate } from "react-router";

import { AppRoute } from "@/app/routes/appRoute";
import { Alert } from "@/components/alert/Alert";
import { Anchor } from "@/components/anchor/Anchor";
import { useActivateAccount } from "@/features/auth/hooks/useActivateAccount";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { getErrorMessage } from "@/utils/getErrorMessage";

export const AccountActivationHandler = () => {
    const t = useTranslate();
    const navigate = useNavigate();
    const { activateAccount, activationToken } = useActivateAccount();
    const { mutateAsync, isSuccess, isPending, error } = activateAccount;

    useEffect(() => {
        if (activationToken) {
            void mutateAsync({ activationToken });
        }
    }, [activationToken, mutateAsync, navigate]);

    const navigateToLoginPage = () => {
        navigate(AppRoute.LOGIN);
    };

    if (isSuccess) {
        return (
            <Alert variant="success">
                {t("authentication.accountActivation.alert.success")}{" "}
                <Anchor onPress={navigateToLoginPage}>{t("authentication.accountActivation.alert.logInLink")}</Anchor>
            </Alert>
        );
    }

    if (isPending) {
        return <Alert variant="info">{t("authentication.accountActivation.alert.loading")}</Alert>;
    }

    if (error) {
        return <Alert variant="danger">{getErrorMessage(error)}</Alert>;
    }

    return <Alert variant="info">{t("authentication.accountActivation.alert.info")}</Alert>;
};
