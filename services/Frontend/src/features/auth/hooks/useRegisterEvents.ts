import { useCallback } from "react";
import { redirect } from "next/navigation";

import { AppRoute } from "@/app/appRoute";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";
import { getErrorMessage } from "@/utils/getErrorMessage";

export const useRegisterEvents = () => {
    const t = useTranslate();

    const onRegisterSuccess = useCallback(() => {
        showToast().success({
            message: t("authentication.registration.notifications.success.body"),
            title: t("authentication.registration.notifications.success.title"),
        });

        redirect(AppRoute.ACTIVATE_ACCOUNT);
    }, [t]);

    const onRegisterError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err),
                title: t("authentication.registration.notifications.error.title"),
            });
        },
        [t]
    );

    return { onRegisterError, onRegisterSuccess };
};
