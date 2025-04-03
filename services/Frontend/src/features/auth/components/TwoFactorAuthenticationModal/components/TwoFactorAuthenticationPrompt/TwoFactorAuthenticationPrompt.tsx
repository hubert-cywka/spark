import { PropsWithChildren } from "react";

import styles from "./styles/TwoFactorAuthenticationPrompt.module.scss";

import { ButtonWithThrottle } from "@/components/ButtonWithThrottle";
import { useRequest2FACodeViaEmail } from "@/features/auth/hooks/2fa/useRequest2FACodeViaEmail.ts";
import { useRequest2FACodeViaEmailEvents } from "@/features/auth/hooks/2fa/useRequest2FACodeViaEmailEvents.ts";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

const RESEND_DELAY = 60;

type TwoFactorAuthenticationPromptProps = PropsWithChildren;

export const EmailTwoFactorAuthenticationPrompt = ({ children }: TwoFactorAuthenticationPromptProps) => {
    const t = useTranslate();

    const { mutateAsync: request2FACodeViaEmail, isPending } = useRequest2FACodeViaEmail();
    const { onRequestError, onRequestSuccess } = useRequest2FACodeViaEmailEvents();

    const handleResendCode = async () => {
        try {
            await request2FACodeViaEmail();
            onRequestSuccess();
        } catch (error) {
            onRequestError(error);
        }
    };

    const formatResendButtonLabel = (seconds: number) => {
        if (seconds) {
            return `${t("authentication.2fa.prompt.modal.resendButton.label")} (${seconds}s)`;
        }

        return t("authentication.2fa.prompt.modal.resendButton.label");
    };

    return (
        <div className={styles.container}>
            <div>
                <h3>{t("authentication.2fa.prompt.modal.methods.email.label")}</h3>
                {t("authentication.2fa.prompt.modal.methods.email.description")}
            </div>

            <div className={styles.inputWrapper}>
                {children}

                <ButtonWithThrottle
                    variant="link"
                    throttle={RESEND_DELAY}
                    label={formatResendButtonLabel}
                    onPress={handleResendCode}
                    isDisabled={isPending}
                />
            </div>
        </div>
    );
};

export const AppTwoFactorAuthenticationPrompt = ({ children }: TwoFactorAuthenticationPromptProps) => {
    const t = useTranslate();

    return (
        <div className={styles.container}>
            <div>
                <h3>{t("authentication.2fa.prompt.modal.methods.app.label")}</h3>
                {t("authentication.2fa.prompt.modal.methods.app.description")}
            </div>
            {children}
        </div>
    );
};
