import { useCallback } from "react";
import { HttpStatusCode } from "axios";

import { ErrorsMap, useTranslateApiError } from "@/hooks/useTranslateApiError";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";

export const useUpdatePasswordEvents = () => {
    const t = useTranslate();
    const getErrorMessage = useTranslateApiError();

    const onPasswordUpdateSuccess = useCallback(() => {
        showToast().success({
            message: t("authentication.passwordReset.notifications.success.body"),
            title: t("authentication.passwordReset.notifications.success.title"),
        });
    }, [t]);

    const onPasswordUpdateError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err, errorsMap),
                title: t("authentication.passwordReset.notifications.error.title"),
            });
        },
        [getErrorMessage, t]
    );

    return { onPasswordUpdateError, onPasswordUpdateSuccess };
};

const errorsMap: ErrorsMap = {
    [HttpStatusCode.NotFound]: "api.authentication.updatePassword.errors.notFound",
};
