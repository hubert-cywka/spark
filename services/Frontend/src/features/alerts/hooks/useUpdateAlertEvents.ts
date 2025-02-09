import { useCallback } from "react";
import { HttpStatusCode } from "axios";

import { ErrorsMap, useTranslateApiError } from "@/hooks/useTranslateApiError";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";

export const useUpdateAlertEvents = () => {
    const t = useTranslate();
    const getErrorMessage = useTranslateApiError();

    const onUpdateAlertSuccess = useCallback(() => {
        showToast().success({
            title: t("alerts.update.notifications.success.title"),
        });
    }, [t]);

    const onUpdateAlertError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err, errorsMap),
                title: t("alerts.update.notifications.error.title"),
            });
        },
        [getErrorMessage, t]
    );

    return { onUpdateAlertSuccess, onUpdateAlertError };
};

const errorsMap: ErrorsMap = {
    [HttpStatusCode.NotFound]: "api.alerts.update.errors.notFound",
};
