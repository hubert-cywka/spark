import { useCallback } from "react";

import { useTranslateApiError } from "@/hooks/useTranslateApiError";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";

export const useRequestPasswordResetTokenEvents = () => {
    const t = useTranslate();
    const getErrorMessage = useTranslateApiError();

    const onPasswordResetRequestSuccess = useCallback(() => {
        showToast().success({
            message: t("authentication.requestPasswordReset.notifications.success.body"),
            title: t("authentication.requestPasswordReset.notifications.success.title"),
        });
    }, [t]);

    const onPasswordResetRequestError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err),
                title: t("authentication.requestPasswordReset.notifications.error.title"),
            });
        },
        [getErrorMessage, t]
    );

    return { onPasswordResetRequestError, onPasswordResetRequestSuccess };
};
