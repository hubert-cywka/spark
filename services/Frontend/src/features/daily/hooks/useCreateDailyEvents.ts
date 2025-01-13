import { useCallback } from "react";

import { ErrorsMap, useTranslateApiError } from "@/hooks/useTranslateApiError";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";

export const useCreateDailyEvents = () => {
    const t = useTranslate();
    const getErrorMessage = useTranslateApiError();

    const onCreateDailySuccess = useCallback(() => {
        showToast().success({
            title: t("daily.create.notifications.success.title"),
            message: t("daily.create.notifications.success.body"),
        });
    }, [t]);

    const onCreateDailyError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err, errorsMap),
                title: t("daily.create.notifications.error.title"),
            });
        },
        [getErrorMessage, t]
    );

    return { onCreateDailyError, onCreateDailySuccess };
};

const errorsMap: ErrorsMap = {};
