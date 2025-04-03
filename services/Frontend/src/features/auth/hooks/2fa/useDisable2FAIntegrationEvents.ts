import { useCallback } from "react";
import { HttpStatusCode } from "axios";

import { ErrorsMap, useTranslateApiError } from "@/hooks/useTranslateApiError.ts";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";
import { logger } from "@/lib/logger/logger.ts";
import { showToast } from "@/lib/notifications/showToast.tsx";

export const useDisable2FAIntegrationEvents = () => {
    const t = useTranslate();
    const getErrorMessage = useTranslateApiError();

    const onDisable2FAMethodError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err, errorsMap),
                title: t("authentication.2fa.disable.notifications.error.title"),
            });
        },
        [getErrorMessage, t]
    );

    return { onDisable2FAIntegrationError: onDisable2FAMethodError };
};

const errorsMap: ErrorsMap = {
    [HttpStatusCode.NotFound]: "api.2fa.confirm.errors.notFound",
    [HttpStatusCode.Conflict]: "api.2fa.confirm.errors.conflict",
};
