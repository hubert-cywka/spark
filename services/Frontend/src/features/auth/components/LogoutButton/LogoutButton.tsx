import { useCallback } from "react";
import { IconPower } from "@tabler/icons-react";

import { Button } from "@/components/Button";
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
        <Button onPress={handleLogout} isLoading={isPending} variant="secondary" size="1" rightDecorator={<IconPower />}>
            {t("common.navigation.logoutButton.label")}
        </Button>
    );
};
