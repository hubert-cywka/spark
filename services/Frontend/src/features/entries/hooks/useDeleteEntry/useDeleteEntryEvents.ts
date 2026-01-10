import { useCallback } from "react";
import { HttpStatusCode } from "axios";

import { ErrorsMap, useTranslateApiError } from "@/hooks/useTranslateApiError";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";

export const useDeleteEntryEvents = () => {
    const t = useTranslate();
    const getErrorMessage = useTranslateApiError();

    const onDeleteEntryError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err, errorsMap),
                title: t("entries.delete.notifications.error.title"),
            });
        },
        [getErrorMessage, t]
    );

    return { onDeleteEntryError };
};

const errorsMap: ErrorsMap = {
    [HttpStatusCode.NotFound]: "api.delete.update.errors.notFound",
};
