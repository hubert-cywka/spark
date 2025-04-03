import { useCallback } from "react";

import { useAuthSession, useTwoFactorAuthentication } from "@/features/auth/hooks";
import { AccessScope } from "@/features/auth/types/Identity";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";
import { showToast } from "@/lib/notifications/showToast.tsx";

export const useAccessValidation = () => {
    const t = useTranslate();
    const accessScopes = useAuthSession((state) => state.scopes);
    const { startAuthenticationProcess } = useTwoFactorAuthentication();

    const validateAccess = useCallback(
        (requiredScopes: AccessScope[]) => {
            if (!requiredScopes?.length) {
                return {
                    hasAccess: true,
                    inactiveScopes: [],
                    missingScopes: [],
                };
            }

            const activeScopes = accessScopes.active || [];
            const inactiveScopes = accessScopes.inactive || [];

            const missingScopes = requiredScopes.filter((required) => ![...activeScopes, ...inactiveScopes].includes(required));
            const hasAccess = requiredScopes.every((required) => activeScopes.includes(required));
            const canGainAccess = !hasAccess && !missingScopes.length;

            return {
                hasAccess,
                canGainAccess,
                inactiveScopes: requiredScopes.filter((required) => inactiveScopes.includes(required)),
            };
        },
        [accessScopes]
    );

    const ensureAccess = (requiredScopes: AccessScope[], onNoAccess?: () => void) => {
        const { inactiveScopes, canGainAccess, hasAccess } = validateAccess(requiredScopes);

        if (!hasAccess && !canGainAccess) {
            if (onNoAccess) {
                onNoAccess();
            } else {
                showToast().danger({
                    title: t("authentication.upgradeSession.notifications.forbidden.title"),
                });
            }

            return false;
        }

        if (!hasAccess && canGainAccess) {
            startAuthenticationProcess(inactiveScopes);
            return false;
        }

        return true;
    };

    return { validateAccess, ensureAccess };
};
