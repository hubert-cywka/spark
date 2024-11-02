"use client";

import { useEffect } from "react";
import { HttpStatusCode } from "axios";

import { AppRoute } from "@/app/appRoute";
import { Alert } from "@/components/Alert";
import { Anchor } from "@/components/Anchor";
import { useActivateAccount } from "@/features/auth/hooks";
import { ErrorsMap, useTranslateApiError } from "@/hooks/useTranslateApiError";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

export const AccountActivationHandler = () => {
    const t = useTranslate();
    const { activateAccount, activationToken } = useActivateAccount();
    const { mutateAsync, isSuccess, isPending, error } = activateAccount;
    const getErrorMessage = useTranslateApiError();

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
        return (
            <Alert variant="danger">{`${t("authentication.accountActivation.alert.error")} "${getErrorMessage(error, errorsMap)}"`}</Alert>
        );
    }

    return <Alert variant="info">{t("authentication.accountActivation.alert.info")}</Alert>;
};

const errorsMap: ErrorsMap = {
    [HttpStatusCode.NotFound]: "api.authentication.activateAccount.errors.notFound",
};
