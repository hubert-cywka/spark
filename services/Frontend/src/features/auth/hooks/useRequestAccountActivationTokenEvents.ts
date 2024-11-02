import { useCallback } from "react";

import { useTranslateApiError } from "@/hooks/useTranslateApiError";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";

export const useRequestAccountActivationTokenEvents = () => {
    const t = useTranslate();
    const getErrorMessage = useTranslateApiError();

    const onRequestActivationSuccess = useCallback(() => {
        showToast().success({
            message: t("authentication.accountActivation.notifications.success.body"),
            title: t("authentication.accountActivation.notifications.success.title"),
        });
    }, [t]);

    const onRequestActivationError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err),
                title: t("authentication.accountActivation.notifications.error.title"),
            });
        },
        [getErrorMessage, t]
    );

    return { onRequestActivationError, onRequestActivationSuccess };
};
