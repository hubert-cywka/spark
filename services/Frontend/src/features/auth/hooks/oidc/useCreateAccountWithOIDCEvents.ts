import { useCallback } from "react";
import { HttpStatusCode } from "axios";
import { useRouter } from "next/navigation";

import { AppRoute } from "@/app/appRoute";
import { ErrorsMap, useTranslateApiError } from "@/hooks/useTranslateApiError";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";

export const useCreateAccountWithOIDCEvents = () => {
    const t = useTranslate();
    const getErrorMessage = useTranslateApiError();
    const router = useRouter();

    const onRegisterSuccess = useCallback(() => {
        showToast().success({
            message: t("authentication.oidc.register.notifications.success.body"),
            title: t("authentication.oidc.register.notifications.success.title"),
        });
        router.push(AppRoute.HOME);
    }, [router, t]);

    const onRegisterError = useCallback(
        (err: unknown) => {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err, errorsMap),
                title: t("authentication.oidc.register.notifications.error.title"),
            });
        },
        [getErrorMessage, t]
    );

    return { onRegisterError, onRegisterSuccess };
};

const errorsMap: ErrorsMap = {
    [HttpStatusCode.Conflict]: "api.oidc.register.errors.conflict",
    [HttpStatusCode.BadRequest]: "api.oidc.register.errors.badRequest",
    [HttpStatusCode.Unauthorized]: "api.oidc.register.errors.unauthorized",
};
