import { useCallback } from "react";

import { useTranslateApiError } from "@/hooks/useTranslateApiError";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";

export const useLoginWithGoogleEvents = () => {
    const t = useTranslate();
    const getErrorMessage = useTranslateApiError();

    const onLoginSuccess = useCallback(() => {
        showToast().success({
            message: t("authentication.oidc.google.notifications.success.body"),
            title: t("authentication.oidc.google.notifications.success.title"),
        });
    }, [t]);

    const onLoginError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err),
                title: t("authentication.oidc.google.notifications.error.title"),
            });
        },
        [getErrorMessage, t]
    );

    return { onLoginError, onLoginSuccess };
};
