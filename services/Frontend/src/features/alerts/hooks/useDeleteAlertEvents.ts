import { useCallback } from "react";
import { HttpStatusCode } from "axios";

import { ErrorsMap, useTranslateApiError } from "@/hooks/useTranslateApiError";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";

export const useDeleteAlertEvents = () => {
    const t = useTranslate();
    const getErrorMessage = useTranslateApiError();

    const onDeleteAlertSuccess = useCallback(() => {
        showToast().success({
            title: t("alerts.delete.notifications.success.title"),
        });
    }, [t]);

    const onDeleteAlertError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err, errorsMap),
                title: t("alerts.delete.notifications.error.title"),
            });
        },
        [getErrorMessage, t]
    );

    return { onDeleteAlertSuccess, onDeleteAlertError };
};

const errorsMap: ErrorsMap = {
    [HttpStatusCode.NotFound]: "api.alerts.delete.errors.notFound",
};
