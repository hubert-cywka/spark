import { useCallback } from "react";
import { HttpStatusCode } from "axios";

import { ErrorsMap, useTranslateApiError } from "@/hooks/useTranslateApiError";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";

export const useDeleteGoalEvents = () => {
    const t = useTranslate();
    const getErrorMessage = useTranslateApiError();

    const onDeleteGoalSuccess = useCallback(() => {
        showToast().success({
            title: t("goals.delete.notifications.success.title"),
        });
    }, [t]);

    const onDeleteGoalError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err, errorsMap),
                title: t("goals.delete.notifications.error.title"),
            });
        },
        [getErrorMessage, t]
    );

    return { onDeleteGoalSuccess, onDeleteGoalError };
};

const errorsMap: ErrorsMap = {
    [HttpStatusCode.NotFound]: "api.goals.delete.errors.notFound",
};
