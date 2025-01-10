import { useCallback } from "react";

import { ErrorsMap, useTranslateApiError } from "@/hooks/useTranslateApiError";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";

export const useCreateGoalEvents = () => {
    const t = useTranslate();
    const getErrorMessage = useTranslateApiError();

    const onCreateGoalSuccess = useCallback(() => {
        showToast().success({
            title: t("goals.create.notifications.success.title"),
        });
    }, [t]);

    const onCreateGoalError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err, errorsMap),
                title: t("goals.create.notifications.error.title"),
            });
        },
        [getErrorMessage, t]
    );

    return { onCreateGoalSuccess, onCreateGoalError };
};

const errorsMap: ErrorsMap = {};
