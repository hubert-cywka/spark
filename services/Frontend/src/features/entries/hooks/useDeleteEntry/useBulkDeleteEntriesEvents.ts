import { useCallback } from "react";

import { ErrorsMap, useTranslateApiError } from "@/hooks/useTranslateApiError.ts";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";
import { logger } from "@/lib/logger/logger.ts";
import { showToast } from "@/lib/notifications/showToast.tsx";

export const useBulkDeleteEntriesEvents = () => {
    const t = useTranslate();
    const getErrorMessage = useTranslateApiError();

    const onDeleteEntriesError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err, errorsMap),
                title: t("entries.bulkDelete.notifications.error.title"),
            });
        },
        [getErrorMessage, t]
    );

    return { onDeleteEntriesError };
};

const errorsMap: ErrorsMap = {};
