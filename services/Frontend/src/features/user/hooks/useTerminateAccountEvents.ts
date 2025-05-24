import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { AppRoute } from "@/app/appRoute";
import { useAuthSession } from "@/features/auth/hooks";
import { ErrorsMap, useTranslateApiError } from "@/hooks/useTranslateApiError";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";

export const useTerminateAccountEvents = () => {
    const t = useTranslate();
    const router = useRouter();
    const getErrorMessage = useTranslateApiError();
    const endSession = useAuthSession((state) => state.endSession);

    const onTerminateAccountSuccess = useCallback(() => {
        endSession();
        showToast().success({
            title: t("user.account.termination.notifications.success.title"),
        });
        router.push(AppRoute.HOME);
    }, [endSession, router, t]);

    const onTerminateAccountError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err, errorsMap),
                title: t("user.account.termination.notifications.error.title"),
            });
        },
        [getErrorMessage, t]
    );

    return { onTerminateAccountError, onTerminateAccountSuccess };
};

const errorsMap: ErrorsMap = {};
