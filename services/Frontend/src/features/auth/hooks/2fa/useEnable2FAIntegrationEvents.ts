import { useCallback } from "react";
import { HttpStatusCode } from "axios";

import { ErrorsMap, useTranslateApiError } from "@/hooks/useTranslateApiError";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";

export const useEnable2FAIntegrationEvents = () => {
    const t = useTranslate();
    const getErrorMessage = useTranslateApiError();

    const onEnable2FAMethodError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                title: t("authentication.2fa.enable.notifications.error.title"),
                message: getErrorMessage(err, errorsMap),
            });
        },
        [getErrorMessage, t]
    );

    return { onEnable2FAIntegrationError: onEnable2FAMethodError };
};

const errorsMap: ErrorsMap = {
    [HttpStatusCode.Conflict]: "api.2fa.confirm.errors.conflict",
};
