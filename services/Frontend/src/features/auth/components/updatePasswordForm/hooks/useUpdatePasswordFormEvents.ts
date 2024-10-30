import { useCallback } from "react";

import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";
import { getErrorMessage } from "@/utils/getErrorMessage";

export const useUpdatePasswordFormEvents = () => {
    const t = useTranslate();

    const onPasswordUpdateSuccess = useCallback(() => {
        showToast().success({
            message: t("authentication.passwordReset.notifications.success.body"),
            title: t("authentication.passwordReset.notifications.success.title"),
        });
    }, [t]);

    const onPasswordUpdateError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err),
                title: t("authentication.passwordReset.notifications.error.title"),
            });
        },
        [t]
    );

    return { onPasswordUpdateError, onPasswordUpdateSuccess };
};
