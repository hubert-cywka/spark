import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AppRoute } from "@/app/appRoute.ts";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";
import { showToast } from "@/lib/notifications/showToast.tsx";

const ERROR_QUERY_PARAM_NAME = "error";
const ACCOUNT_SUSPENDED_ERROR_CODE = "ACCOUNT_SUSPENDED";

export const useHandleOIDCError = () => {
    const t = useTranslate();
    const router = useRouter();
    const searchParams = useSearchParams();
    const error = useMemo(() => searchParams.get(ERROR_QUERY_PARAM_NAME), [searchParams]);

    const onOIDCError = useCallback(() => {
        if (error === ACCOUNT_SUSPENDED_ERROR_CODE) {
            showToast().danger({
                message: t("api.oidc.login.errors.suspended"),
                title: t("authentication.oidc.login.notifications.error.title"),
            });
        } else {
            showToast().danger({
                message: t("api.oidc.login.errors.default"),
                title: t("authentication.oidc.login.notifications.error.title"),
            });
        }

        router.push(AppRoute.LOGIN);
    }, [error, router, t]);

    return { hasOIDCFailed: !!error, onOIDCError };
};
