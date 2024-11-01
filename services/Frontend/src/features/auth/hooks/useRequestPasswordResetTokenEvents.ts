import { useCallback } from "react";

import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";
import { getErrorMessage } from "@/utils/getErrorMessage";

export const useRequestPasswordResetTokenEvents = () => {
    const t = useTranslate();

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
        [t]
    );

    return { onPasswordResetRequestError, onPasswordResetRequestSuccess };
};
