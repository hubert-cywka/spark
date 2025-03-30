"use client";

import styles from "./styles/TwoFactorAuthenticationConfiguration.module.scss";

import { TwoFactorAuthenticationOption } from "@/features/auth/components/TwoFactorAuthenticationConfiguration/components/TwoFactorAuthenticationOption";
import { TwoFactorAuthenticationStrategy } from "@/features/auth/types/TwoFactorAuthentication";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

export const TwoFactorAuthenticationConfiguration = () => {
    const t = useTranslate();

    const handle2FAOptionStateChange = (strategy: TwoFactorAuthenticationStrategy, value: boolean) => {
        // TODO
        console.log({ strategy, value });
    };

    const available2FAOptions = [
        {
            label: t("authentication.2fa.configuration.options.email.label"),
            strategy: "email",
        },
        {
            label: t("authentication.2fa.configuration.options.authenticator.label"),
            strategy: "authenticator_app",
        },
    ] as const;

    return (
        <div className={styles.container}>
            <h3 className={styles.optionsHeader}>{t("authentication.2fa.configuration.optionsHeader")}</h3>

            <ul className={styles.options}>
                {available2FAOptions.map(({ label, strategy }) => (
                    <TwoFactorAuthenticationOption
                        key={strategy}
                        label={label}
                        strategy={strategy}
                        isEnabled={strategy === "email"}
                        onChange={handle2FAOptionStateChange}
                    />
                ))}
            </ul>
        </div>
    );
};
