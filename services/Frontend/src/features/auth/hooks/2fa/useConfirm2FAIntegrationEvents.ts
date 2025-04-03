import { useCallback } from "react";
import { HttpStatusCode } from "axios";

import { ErrorsMap, useTranslateApiError } from "@/hooks/useTranslateApiError.ts";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";
import { logger } from "@/lib/logger/logger.ts";
import { showToast } from "@/lib/notifications/showToast.tsx";

export const useConfirm2FAIntegrationEvents = () => {
    const t = useTranslate();
    const getErrorMessage = useTranslateApiError();

    const onConfirm2FAMethodSuccess = useCallback(() => {
        showToast().success({
            title: t("authentication.2fa.confirm.notifications.success.title"),
        });
    }, [t]);

    const onConfirm2FAMethodError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err, errorsMap),
                title: t("authentication.2fa.confirm.notifications.error.title"),
            });
        },
        [getErrorMessage, t]
    );

    return {
        onConfirm2FAIntegrationError: onConfirm2FAMethodError,
        onConfirm2FAIntegrationSuccess: onConfirm2FAMethodSuccess,
    };
};

const errorsMap: ErrorsMap = {
    [HttpStatusCode.NotFound]: "api.2fa.confirm.errors.notFound",
    [HttpStatusCode.Conflict]: "api.2fa.confirm.errors.conflict",
    [HttpStatusCode.Forbidden]: "api.2fa.confirm.errors.forbidden",
};
