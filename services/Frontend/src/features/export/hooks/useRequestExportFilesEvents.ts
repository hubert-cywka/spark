import { useCallback } from "react";
import { HttpStatusCode } from "axios";

import { ErrorsMap, useTranslateApiError } from "@/hooks/useTranslateApiError.ts";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";
import { logger } from "@/lib/logger/logger.ts";
import { showToast } from "@/lib/notifications/showToast.tsx";

export const useRequestExportFilesEvents = () => {
    const t = useTranslate();
    const getErrorMessage = useTranslateApiError();

    const onRequestError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err, errorsMap),
                title: t("exports.download.notifications.error.title"),
            });
        },
        [getErrorMessage, t]
    );

    return { onRequestError };
};

const errorsMap: ErrorsMap = {
    [HttpStatusCode.NotFound]: "api.exports.download.errors.notFound",
    [HttpStatusCode.Conflict]: "api.exports.download.errors.conflict",
};
