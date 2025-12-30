import { useCallback } from "react";
import { HttpStatusCode } from "axios";

import { ErrorsMap, useTranslateApiError } from "@/hooks/useTranslateApiError";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";

export const useStartExportEvents = () => {
    const t = useTranslate();
    const getErrorMessage = useTranslateApiError();

    const onStartExportSuccess = useCallback(() => {
        showToast().success({
            title: t("exports.start.notifications.success.title"),
            message: t("exports.start.notifications.success.body"),
        });
    }, [t]);

    const onStartExportError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err, errorsMap),
                title: t("exports.start.notifications.error.title"),
            });
        },
        [getErrorMessage, t]
    );

    return { onStartExportSuccess, onStartExportError };
};

const errorsMap: ErrorsMap = {
    [HttpStatusCode.Conflict]: "api.exports.start.errors.conflict",
};
