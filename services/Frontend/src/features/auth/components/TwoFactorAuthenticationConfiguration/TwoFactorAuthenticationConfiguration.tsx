"use client";

import { useState } from "react";

import styles from "./styles/TwoFactorAuthenticationConfiguration.module.scss";

import { TwoFactorAuthenticationOption } from "@/features/auth/components/TwoFactorAuthenticationConfiguration/components/TwoFactorAuthenticationOption";
import { TwoFactorAuthenticationEnableModal } from "@/features/auth/components/TwoFactorAuthenticationEnableModal/TwoFactorAuthenticationEnableModal.tsx";
import {
    AppTwoFactorAuthenticationEnablePrompt,
    EmailTwoFactorAuthenticationEnablePrompt,
} from "@/features/auth/components/TwoFactorAuthenticationEnablePrompt";
import { useAccessValidation } from "@/features/auth/hooks";
import { useDisable2FAMethod } from "@/features/auth/hooks/2fa/useDisable2FAMethod.ts";
import { useDisable2FAMethodEvents } from "@/features/auth/hooks/2fa/useDisable2FAMethodEvents.ts";
import { useEnable2FAMethodEvents } from "@/features/auth/hooks/2fa/useEnable2FAMethodEvents.ts";
import { useEnableAuthenticatorAppMethod } from "@/features/auth/hooks/2fa/useEnableAuthenticatorAppMethod.ts";
import { useEnableEmailMethod } from "@/features/auth/hooks/2fa/useEnableEmailMethod.ts";
import { useGetEnabled2FAOptions } from "@/features/auth/hooks/2fa/useGetEnabled2FAOptions.ts";
import { TwoFactorAuthenticationMethod } from "@/features/auth/types/TwoFactorAuthentication";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";
import { showToast } from "@/lib/notifications/showToast.tsx";

export const TwoFactorAuthenticationConfiguration = () => {
    const t = useTranslate();
    const { data: enabled2FAOptions } = useGetEnabled2FAOptions();

    const { mutateAsync: enableAuthenticatorApp } = useEnableAuthenticatorAppMethod();
    const { mutateAsync: enableEmail } = useEnableEmailMethod();
    const { mutateAsync: disable2FA } = useDisable2FAMethod();
    const { ensureAccess } = useAccessValidation();

    const [methodToEnable, setMethodToEnable] = useState<TwoFactorAuthenticationMethod | null>(null);
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

    const { onEnable2FAMethodError } = useEnable2FAMethodEvents();
    const { onDisable2FAMethodSuccess, onDisable2FAMethodError } = useDisable2FAMethodEvents();

    const closeModal = () => {
        setMethodToEnable(null);
        setQrCodeUrl(null);
    };

    const openAuthenticatorAppModal = (url: string) => {
        setMethodToEnable("app");
        setQrCodeUrl(url);
    };

    const openEmailModal = () => {
        setMethodToEnable("email");
    };

    const handle2FAOptionStateChange = async (method: TwoFactorAuthenticationMethod, isEnabled: boolean) => {
        if (isEnabled) {
            await enable2FAMethod(method);
        } else {
            await disable2FAMethodIfAllowed(method);
        }
    };

    const enable2FAMethod = async (method: TwoFactorAuthenticationMethod) => {
        if (!ensureAccess(["write:2fa"])) return;

        try {
            switch (method) {
                case "app":
                    {
                        const qrUrl = await enableAuthenticatorApp();
                        openAuthenticatorAppModal(qrUrl);
                    }
                    break;
                case "email":
                    await enableEmail();
                    openEmailModal();
                    break;
            }
        } catch (error) {
            onEnable2FAMethodError(error);
        }
    };

    const disable2FAMethodIfAllowed = async (method: TwoFactorAuthenticationMethod) => {
        if (!ensureAccess(["delete:2fa"])) return;

        if (!enabled2FAOptions || enabled2FAOptions.length <= 1) {
            showToast().danger({
                title: t("authentication.2fa.disable.notifications.error.title"),
                message: t("authentication.2fa.disable.notifications.error.body"),
            });
            return;
        }

        try {
            await disable2FA(method);
            onDisable2FAMethodSuccess();
        } catch (error) {
            onDisable2FAMethodError(error);
        }
    };

    const isAppEnabled = !!enabled2FAOptions?.find((opt) => opt.method === "app");
    const isEmailEnabled = !!enabled2FAOptions?.find((opt) => opt.method === "email");

    const methodSteps = {
        app: <AppTwoFactorAuthenticationEnablePrompt url={qrCodeUrl ?? ""} onEnabled={closeModal} />,
        email: <EmailTwoFactorAuthenticationEnablePrompt onEnabled={closeModal} />,
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.optionsHeader}>{t("authentication.2fa.configuration.optionsHeader")}</h3>

            <ul className={styles.options}>
                <TwoFactorAuthenticationOption
                    key="app"
                    method="app"
                    label={t("authentication.2fa.configuration.options.authenticator.label")}
                    isEnabled={isAppEnabled}
                    onChange={handle2FAOptionStateChange}
                />

                <TwoFactorAuthenticationOption
                    key="email"
                    method="email"
                    label={t("authentication.2fa.configuration.options.email.label")}
                    isEnabled={isEmailEnabled}
                    onChange={handle2FAOptionStateChange}
                />
            </ul>

            <TwoFactorAuthenticationEnableModal isOpen={!!methodToEnable} onClose={closeModal}>
                {methodToEnable && methodSteps[methodToEnable]}
            </TwoFactorAuthenticationEnableModal>
        </div>
    );
};
