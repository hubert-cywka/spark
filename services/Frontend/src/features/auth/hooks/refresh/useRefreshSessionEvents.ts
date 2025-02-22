import { useCallback } from "react";
import { HttpStatusCode } from "axios";

import { ErrorsMap, useTranslateApiError } from "@/hooks/useTranslateApiError";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";

export const useRefreshSessionEvents = () => {
    const t = useTranslate();
    const getErrorMessage = useTranslateApiError();

    const onRefreshSuccess = useCallback(() => {
        showToast().success({
            message: t("authentication.refresh.notifications.success.body"),
            title: t("authentication.refresh.notifications.success.title"),
        });
    }, [t]);

    const onRefreshError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err, errorsMap),
                title: t("authentication.refresh.notifications.error.title"),
            });
        },
        [getErrorMessage, t]
    );

    return { onRefreshError, onRefreshSuccess };
};

const errorsMap: ErrorsMap = {
    [HttpStatusCode.Unauthorized]: "api.authentication.refresh.errors.unauthorized",
};
