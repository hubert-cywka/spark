"use client";

import { useEffect } from "react";

import { AppRoute } from "@/app/appRoute";
import { Alert } from "@/components/alert/Alert";
import { Anchor } from "@/components/anchor/Anchor";
import { useActivateAccount } from "@/features/auth/hooks/useActivateAccount";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { getErrorMessage } from "@/utils/getErrorMessage";

export const AccountActivationHandler = () => {
    const t = useTranslate();
    const { activateAccount, activationToken } = useActivateAccount();
    const { mutateAsync, isSuccess, isPending, error } = activateAccount;

    useEffect(() => {
        if (activationToken) {
            void mutateAsync({ activationToken });
        }
    }, [activationToken, mutateAsync]);

    if (isSuccess) {
        return (
            <Alert variant="success">
                {t("authentication.accountActivation.alert.success")}{" "}
                <Anchor href={AppRoute.LOGIN}>{t("authentication.accountActivation.alert.logInLink")}</Anchor>
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
