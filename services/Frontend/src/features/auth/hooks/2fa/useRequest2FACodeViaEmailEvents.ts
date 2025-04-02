import { useCallback } from "react";
import { HttpStatusCode } from "axios";

import { ErrorsMap, useTranslateApiError } from "@/hooks/useTranslateApiError";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";

export const useRequest2FACodeViaEmailEvents = () => {
    const t = useTranslate();
    const getErrorMessage = useTranslateApiError();

    const onRequestSuccess = useCallback(() => {
        showToast().success({
            message: t("authentication.2fa.requestCode.email.notifications.success.body"),
            title: t("authentication.2fa.requestCode.email.notifications.success.title"),
        });
    }, [t]);

    const onRequestError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err, errorsMap),
                title: t("authentication.2fa.requestCode.email.notifications.error.title"),
            });
        },
        [getErrorMessage, t]
    );

    return { onRequestError, onRequestSuccess };
};

const errorsMap: ErrorsMap = {
    [HttpStatusCode.Conflict]: "api.2fa.requestCode.email.conflict",
    [HttpStatusCode.BadRequest]: "api.2fa.requestCode.email.badRequest",
    [HttpStatusCode.Unauthorized]: "api.2fa.requestCode.email.unauthorized",
};
