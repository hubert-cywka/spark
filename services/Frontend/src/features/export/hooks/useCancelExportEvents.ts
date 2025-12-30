import { useCallback } from "react";
import { HttpStatusCode } from "axios";

import { ErrorsMap, useTranslateApiError } from "@/hooks/useTranslateApiError";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";

export const useCancelExportEvents = () => {
    const t = useTranslate();
    const getErrorMessage = useTranslateApiError();

    const onCancelExportSuccess = useCallback(() => {
        showToast().success({
            title: t("exports.cancel.notifications.success.title"),
            message: t("exports.cancel.notifications.success.body"),
        });
    }, [t]);

    const onCancelExportError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err, errorsMap),
                title: t("exports.cancel.notifications.error.title"),
            });
        },
        [getErrorMessage, t]
    );

    return { onCancelExportSuccess, onCancelExportError };
};

const errorsMap: ErrorsMap = {
    [HttpStatusCode.NotFound]: "api.exports.cancel.errors.notFound",
    [HttpStatusCode.Conflict]: "api.exports.cancel.errors.conflict",
};
