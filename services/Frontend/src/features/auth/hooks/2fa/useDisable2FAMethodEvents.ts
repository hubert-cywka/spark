import { useCallback } from "react";

import { ErrorsMap, useTranslateApiError } from "@/hooks/useTranslateApiError.ts";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";
import { logger } from "@/lib/logger/logger.ts";
import { showToast } from "@/lib/notifications/showToast.tsx";

export const useDisable2FAMethodEvents = () => {
    const t = useTranslate();
    const getErrorMessage = useTranslateApiError();

    const onDisable2FAMethodSuccess = useCallback(() => {
        showToast().success({
            message: t("authentication.2fa.disable.notifications.success.body"),
            title: t("authentication.2fa.disable.notifications.success.title"),
        });
    }, [t]);

    const onDisable2FAMethodError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err, errorsMap),
                title: t("authentication.2fa.disable.notifications.error.title"),
            });
        },
        [getErrorMessage, t]
    );

    return { onDisable2FAMethodError, onDisable2FAMethodSuccess };
};

// TODO
const errorsMap: ErrorsMap = {};
