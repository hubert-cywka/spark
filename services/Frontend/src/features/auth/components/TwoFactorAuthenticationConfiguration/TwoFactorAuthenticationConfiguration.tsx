"use client";

import { useState } from "react";

import styles from "./styles/TwoFactorAuthenticationConfiguration.module.scss";

import { TwoFactorAuthenticationIntegrationItem } from "@/features/auth/components/TwoFactorAuthenticationConfiguration/components/TwoFactorAuthenticationIntegrationItem";
import { TwoFactorAuthenticationEnableIntegrationModal } from "@/features/auth/components/TwoFactorAuthenticationEnableModal";
import { useAccessValidation } from "@/features/auth/hooks";
import { useDisable2FAIntegrationEvents } from "@/features/auth/hooks/2fa/useDisable2FAIntegrationEvents.ts";
import { useDisable2FAMethod } from "@/features/auth/hooks/2fa/useDisable2FAMethod.ts";
import { useEnable2FAIntegrationEvents } from "@/features/auth/hooks/2fa/useEnable2FAIntegrationEvents.ts";
import { useEnableApp2FAIntegration } from "@/features/auth/hooks/2fa/useEnableApp2FAIntegration.ts";
import { useEnableEmail2FAIntegration } from "@/features/auth/hooks/2fa/useEnableEmail2FAIntegration.ts";
import { useGetActive2FAIntegrations } from "@/features/auth/hooks/2fa/useGetActive2FAIntegrations.ts";
import { TwoFactorAuthenticationMethod } from "@/features/auth/types/TwoFactorAuthentication";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";
import { showToast } from "@/lib/notifications/showToast.tsx";

export const TwoFactorAuthenticationConfiguration = () => {
    const t = useTranslate();
    const { data: active2FAIntegrations } = useGetActive2FAIntegrations();

    const { mutateAsync: enableAuthenticatorApp } = useEnableApp2FAIntegration();
    const { mutateAsync: enableEmail, isPending } = useEnableEmail2FAIntegration();
    const { mutateAsync: disable2FA } = useDisable2FAMethod();
    const { ensureAccess } = useAccessValidation();

    const [integrationMethod, setIntegrationMethod] = useState<TwoFactorAuthenticationMethod | null>(null);
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

    const { onEnable2FAIntegrationError } = useEnable2FAIntegrationEvents();
    const { onDisable2FAIntegrationError } = useDisable2FAIntegrationEvents();

    const closeModal = () => {
        setIntegrationMethod(null);
        setQrCodeUrl(null);
    };

    const openAuthenticatorAppModal = (url: string) => {
        setIntegrationMethod("app");
        setQrCodeUrl(url);
    };

    const openEmailModal = () => {
        setIntegrationMethod("email");
    };

    const handle2FAIntegrationStateChange = async (method: TwoFactorAuthenticationMethod, isEnabled: boolean) => {
        if (isEnabled) {
            await enable2FAIntegration(method);
        } else {
            await disable2FAIntegrationIfAllowed(method);
        }
    };

    const enable2FAIntegration = async (method: TwoFactorAuthenticationMethod) => {
        if (!ensureAccess(["write:2fa"])) {
            return;
        }

        let qrCodeUrl = "";

        try {
            switch (method) {
                case "app":
                    qrCodeUrl = await enableAuthenticatorApp();
                    openAuthenticatorAppModal(qrCodeUrl);
                    break;
                case "email":
                    await enableEmail();
                    openEmailModal();
                    break;
            }
        } catch (error) {
            onEnable2FAIntegrationError(error);
        }
    };

    const disable2FAIntegrationIfAllowed = async (method: TwoFactorAuthenticationMethod) => {
        if (!active2FAIntegrations || active2FAIntegrations.length <= 1) {
            showToast().danger({
                title: t("authentication.2fa.disable.notifications.2faRequired.title"),
                message: t("authentication.2fa.disable.notifications.2faRequired.body"),
            });
            return;
        }

        if (!ensureAccess(["delete:2fa"])) {
            return;
        }

        try {
            await disable2FA(method);
        } catch (error) {
            onDisable2FAIntegrationError(error);
        }
    };

    const isAppEnabled = !!active2FAIntegrations?.find((integration) => integration.method === "app");
    const isEmailEnabled = !!active2FAIntegrations?.find((integration) => integration.method === "email");

    return (
        <div className={styles.container}>
            <h3 className={styles.optionsHeader}>{t("authentication.2fa.configuration.optionsHeader")}</h3>

            <ul className={styles.options}>
                <TwoFactorAuthenticationIntegrationItem
                    key="app"
                    method="app"
                    label={t("authentication.2fa.configuration.options.authenticator.label")}
                    isEnabled={isAppEnabled}
                    onChange={handle2FAIntegrationStateChange}
                />

                <TwoFactorAuthenticationIntegrationItem
                    key="email"
                    method="email"
                    label={t("authentication.2fa.configuration.options.email.label")}
                    isEnabled={isEmailEnabled}
                    onChange={handle2FAIntegrationStateChange}
                />
            </ul>

            {integrationMethod && (
                <TwoFactorAuthenticationEnableIntegrationModal
                    isOpen={true}
                    onClose={closeModal}
                    method={integrationMethod}
                    url={integrationMethod === "app" ? qrCodeUrl ?? "" : undefined}
                    canResendCode={integrationMethod === "email" ? !isPending : undefined}
                    onResendCode={integrationMethod === "email" ? () => enable2FAIntegration("email") : undefined}
                />
            )}
        </div>
    );
};
