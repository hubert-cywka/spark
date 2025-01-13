import { useCallback } from "react";
import { HttpStatusCode } from "axios";

import { ErrorsMap, useTranslateApiError } from "@/hooks/useTranslateApiError";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";

export const useUpdateDailyDateEvents = () => {
    const t = useTranslate();
    const getErrorMessage = useTranslateApiError();

    const onUpdateDailyDateSuccess = useCallback(() => {
        showToast().success({
            title: t("daily.updateDate.notifications.success.title"),
            message: t("daily.updateDate.notifications.success.body"),
        });
    }, [t]);

    const onUpdateDailyDateError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err, errorsMap),
                title: t("daily.updateDate.notifications.error.title"),
            });
        },
        [getErrorMessage, t]
    );

    return { onUpdateDailyDateError, onUpdateDailyDateSuccess };
};

const errorsMap: ErrorsMap = {
    [HttpStatusCode.NotFound]: "api.daily.updateDate.errors.notFound",
};
