import { useAuthSession, useTwoFactorAuthentication } from "@/features/auth/hooks";
import { AccessScope } from "@/features/auth/types/Identity";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";
import { showToast } from "@/lib/notifications/showToast.tsx";

export const useActivateAccessScopes = () => {
    const t = useTranslate();
    const { active, inactive } = useAuthSession((state) => state.scopes);
    const { startAuthorizationProcess } = useTwoFactorAuthentication();

    const activate = (...scopes: AccessScope[]) => {
        if (active.some((activeScope) => scopes.includes(activeScope))) {
            showToast().info({
                title: t("authorization.scopes.errors.alreadyActive"),
            });
            return;
        }

        if (inactive.some((inactiveScope) => !scopes.includes(inactiveScope))) {
            showToast().danger({
                title: t("authorization.scopes.errors.forbidden"),
            });
        }

        startAuthorizationProcess();
    };

    return { activate };
};
