import { useCallback } from "react";
import { AxiosError, HttpStatusCode } from "axios";

import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

export type ErrorsMap = Record<number, string>;

export const useTranslateApiError = () => {
    const t = useTranslate();

    return useCallback(
        (error: unknown, errorsMap?: ErrorsMap) => {
            if (!(error instanceof Error)) {
                return "Unknown error";
            }

            if (!(error instanceof AxiosError) || !error.status) {
                return error.message;
            }

            const errorsMapWithDefaults = { ...defaultErrorsMap, ...errorsMap };
            const mappedErrorMessage = errorsMapWithDefaults[error.status];

            return mappedErrorMessage ? t(mappedErrorMessage) : error.message;
        },
        [t]
    );
};

const defaultErrorsMap: ErrorsMap = {
    [HttpStatusCode.TooManyRequests]: "api.common.errors.tooManyRequests",
    [HttpStatusCode.InternalServerError]: "api.common.errors.internalServerError",
    [HttpStatusCode.ServiceUnavailable]: "api.common.errors.serviceUnavailable",
};
