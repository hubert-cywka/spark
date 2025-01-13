import { useCallback } from "react";
import { HttpStatusCode } from "axios";

import { ErrorsMap, useTranslateApiError } from "@/hooks/useTranslateApiError";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";

export const useDeleteDailyEvents = () => {
    const t = useTranslate();
    const getErrorMessage = useTranslateApiError();

    const onDeleteDailySuccess = useCallback(() => {
        showToast().success({
            title: t("daily.delete.notifications.success.title"),
        });
    }, [t]);

    const onDeleteDailyError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err, errorsMap),
                title: t("daily.delete.notifications.error.title"),
            });
        },
        [getErrorMessage, t]
    );

    return { onDeleteDailyError, onDeleteDailySuccess };
};

const errorsMap: ErrorsMap = {
    [HttpStatusCode.NotFound]: "api.daily.delete.errors.notFound",
};
