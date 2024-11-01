import { useCallback } from "react";

import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";
import { getErrorMessage } from "@/utils/getErrorMessage";

export const useLoginWithGoogleEvents = () => {
    const t = useTranslate();

    const onLoginSuccess = useCallback(() => {
        showToast().success({
            message: t("authentication.oauth.google.notifications.success.body"),
            title: t("authentication.oauth.google.notifications.success.title"),
        });
    }, [t]);

    const onLoginError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err),
                title: t("authentication.oauth.google.notifications.error.title"),
            });
        },
        [t]
    );

    return { onLoginError, onLoginSuccess };
};
