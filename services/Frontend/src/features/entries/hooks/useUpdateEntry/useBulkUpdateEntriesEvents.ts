import { useCallback } from "react";

import { ErrorsMap, useTranslateApiError } from "@/hooks/useTranslateApiError";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";

export const useBulkUpdateEntriesEvents = () => {
    const t = useTranslate();
    const getErrorMessage = useTranslateApiError();

    const onUpdateEntriesError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err, errorsMap),
                title: t("entries.bulkUpdate.notifications.error.title"),
            });
        },
        [getErrorMessage, t]
    );

    return { onUpdateEntriesError };
};

const errorsMap: ErrorsMap = {};
