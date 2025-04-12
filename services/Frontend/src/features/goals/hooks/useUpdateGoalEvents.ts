import { useCallback } from "react";
import { HttpStatusCode } from "axios";

import { ErrorsMap, useTranslateApiError } from "@/hooks/useTranslateApiError";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";

export const useUpdateGoalEvents = () => {
    const t = useTranslate();
    const getErrorMessage = useTranslateApiError();

    const onUpdateGoalSuccess = useCallback(() => {
        showToast().success({
            title: t("goals.update.notifications.success.title"),
        });
    }, [t]);

    const onUpdateGoalError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err, errorsMap),
                title: t("goals.update.notifications.error.title"),
            });
        },
        [getErrorMessage, t]
    );

    return { onUpdateGoalSuccess, onUpdateGoalError };
};

const errorsMap: ErrorsMap = {
    [HttpStatusCode.NotFound]: "api.goals.update.errors.notFound",
};
