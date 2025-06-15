"use client";

import { useCallback } from "react";
import { LogOut } from "lucide-react";

import { Button, ButtonSize, ButtonVariant } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { useLogout, useLogoutEvents } from "@/features/auth/hooks";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

type LogoutButtonProps = {
    logoutFromAllSessions?: boolean;
    variant?: ButtonVariant;
    size?: ButtonSize;
};

export const LogoutButton = ({ logoutFromAllSessions, variant = "subtle", size = "2" }: LogoutButtonProps) => {
    const t = useTranslate();
    const { mutateAsync: logout, isPending } = useLogout();
    const { onLogoutError, onLogoutSuccess } = useLogoutEvents();

    const handleLogout = useCallback(async () => {
        try {
            await logout({ allSessions: logoutFromAllSessions });
            onLogoutSuccess();
        } catch (err) {
            onLogoutError(err);
        }
    }, [logout, logoutFromAllSessions, onLogoutError, onLogoutSuccess]);

    return (
        <Button onPress={handleLogout} isLoading={isPending} variant={variant} size={size} rightDecorator={<Icon slot={LogOut} size="1" />}>
            {t("common.navigation.logoutButton.label")}
        </Button>
    );
};
