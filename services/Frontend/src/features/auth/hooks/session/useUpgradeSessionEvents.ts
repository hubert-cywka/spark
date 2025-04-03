import { useCallback } from "react";
import { HttpStatusCode } from "axios";

import { ErrorsMap, useTranslateApiError } from "@/hooks/useTranslateApiError";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";

export const useUpgradeSessionEvents = () => {
    const t = useTranslate();
    const getErrorMessage = useTranslateApiError();

    const onSessionUpgradeSuccess = useCallback(() => {
        showToast().success({
            message: t("authentication.upgradeSession.notifications.success.body"),
            title: t("authentication.upgradeSession.notifications.success.title"),
        });
    }, [t]);

    const onSessionUpgradeError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err, errorsMap),
                title: t("authentication.upgradeSession.notifications.error.title"),
            });
        },
        [getErrorMessage, t]
    );

    return { onSessionUpgradeError, onSessionUpgradeSuccess };
};

const errorsMap: ErrorsMap = {
    [HttpStatusCode.Forbidden]: "api.authentication.upgradeSession.errors.forbidden",
    [HttpStatusCode.Unauthorized]: "api.authentication.upgradeSession.errors.unauthorized",
};
