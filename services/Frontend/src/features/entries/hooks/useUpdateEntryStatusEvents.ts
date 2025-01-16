import { useCallback } from "react";
import { HttpStatusCode } from "axios";

import { ErrorsMap, useTranslateApiError } from "@/hooks/useTranslateApiError";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";

export const useUpdateEntryStatusEvents = () => {
    const t = useTranslate();
    const getErrorMessage = useTranslateApiError();

    const onUpdateEntryStatusError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err, errorsMap),
                title: t("entries.updateStatus.notifications.error.title"),
            });
        },
        [getErrorMessage, t]
    );

    return { onUpdateEntryStatusError };
};

const errorsMap: ErrorsMap = {
    [HttpStatusCode.NotFound]: "api.entries.updateStatus.errors.notFound",
};
