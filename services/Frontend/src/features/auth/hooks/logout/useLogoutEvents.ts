import { useCallback } from "react";
import { HttpStatusCode } from "axios";
import { useRouter } from "next/navigation";

import { AppRoute } from "@/app/appRoute";
import { useAuthStore } from "@/features/auth/hooks";
import { ErrorsMap, useTranslateApiError } from "@/hooks/useTranslateApiError";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";

export const useLogoutEvents = () => {
    const t = useTranslate();
    const router = useRouter();
    const getErrorMessage = useTranslateApiError();

    const removeIdentity = useAuthStore((state) => state.removeIdentity);
    const removeAccessToken = useAuthStore((state) => state.removeAccessToken);

    const onLogoutSuccess = useCallback(() => {
        showToast().success({
            message: t("authentication.logout.notifications.success.body"),
            title: t("authentication.logout.notifications.success.title"),
        });
        removeIdentity();
        removeAccessToken();
        router.push(AppRoute.LOGIN);
    }, [removeAccessToken, removeIdentity, router, t]);

    const onLogoutError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err, errorsMap),
                title: t("authentication.logout.notifications.error.title"),
            });
        },
        [getErrorMessage, t]
    );

    return { onLogoutSuccess, onLogoutError };
};

const errorsMap: ErrorsMap = {
    [HttpStatusCode.Unauthorized]: "api.authentication.logout.errors.unauthorized",
};
