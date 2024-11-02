import { useCallback } from "react";
import { IconPower } from "@tabler/icons-react";

import { IconButton } from "@/components/IconButton";
import { useLogout, useLogoutEvents } from "@/features/auth/hooks";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

export const LogoutButton = () => {
    const t = useTranslate();
    const { mutateAsync: logout, isPending } = useLogout();
    const { onLogoutError, onLogoutSuccess } = useLogoutEvents();

    const handleLogout = useCallback(async () => {
        try {
            await logout();
            onLogoutSuccess();
        } catch (err) {
            onLogoutError(err);
        }
    }, [logout, onLogoutError, onLogoutSuccess]);

    return (
        <IconButton
            onPress={handleLogout}
            isLoading={isPending}
            variant="secondary"
            tooltip={t("common.navigation.logoutButton.label")}
            aria-label={t("common.navigation.logoutButton.label")}
        >
            <IconPower />
        </IconButton>
    );
};
