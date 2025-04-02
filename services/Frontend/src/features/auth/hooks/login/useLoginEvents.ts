import { useCallback } from "react";
import { HttpStatusCode } from "axios";
import { useRouter } from "next/navigation";

import { AppRoute } from "@/app/appRoute";
import { ErrorsMap, useTranslateApiError } from "@/hooks/useTranslateApiError";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";

export const useLoginEvents = () => {
    const t = useTranslate();
    const router = useRouter();
    const getErrorMessage = useTranslateApiError();

    const onLoginSuccess = useCallback(() => {
        showToast().success({
            message: t("authentication.login.notifications.success.body"),
            title: t("authentication.login.notifications.success.title"),
        });
        router.push(AppRoute.HOME);
    }, [router, t]);

    const onLoginError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err, errorsMap),
                title: t("authentication.login.notifications.error.title"),
            });
        },
        [getErrorMessage, t]
    );

    return { onLoginError, onLoginSuccess };
};

const errorsMap: ErrorsMap = {
    [HttpStatusCode.Unauthorized]: "api.authentication.login.errors.unauthorized",
    [HttpStatusCode.Forbidden]: "api.authentication.login.errors.forbidden",
};
