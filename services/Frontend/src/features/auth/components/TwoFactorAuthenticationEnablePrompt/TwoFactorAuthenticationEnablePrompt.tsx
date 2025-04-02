import { useState } from "react";
import QRCode from "react-qr-code";

import styles from "./styles/TwoFactorAuthenticationEnablePrompt.module.scss";

import { Button } from "@/components/Button";
import { CodeInput } from "@/components/Input";
import { TWO_FACTOR_AUTH_CODE_LENGTH } from "@/features/auth/constants";
import { useConfirm2FAMethod } from "@/features/auth/hooks/2fa/useConfirm2FAMethod.ts";
import { useConfirm2FAMethodEvents } from "@/features/auth/hooks/2fa/useConfirm2FAMethodEvents.ts";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

export const AppTwoFactorAuthenticationEnablePrompt = ({ url, onEnabled }: { url: string; onEnabled: () => void }) => {
    const [code, setCode] = useState("");
    const { mutateAsync: confirmApp2FA, isPending: isConfirming } = useConfirm2FAMethod();
    const t = useTranslate();
    const { onConfirm2FAMethodSuccess, onConfirm2FAMethodError } = useConfirm2FAMethodEvents();

    const handleConfirmApp2FA = async () => {
        try {
            await confirmApp2FA({ method: "app", code });
            onConfirm2FAMethodSuccess();
            onEnabled();
        } catch (error) {
            onConfirm2FAMethodError(error);
        }
    };

    // TODO: Translations
    return (
        <div className={styles.container}>
            {t("authentication.2fa.enable.modal.methods.app.description")}
            <b>Until you enter valid confirmation code, each time we will generate new, unique QR code.</b>

            <div className={styles.inputWrapper}>
                <QRCode value={url} />
                <CodeInput
                    label={t("authentication.2fa.enable.modal.codeInput.label")}
                    value={code}
                    onChange={setCode}
                    length={TWO_FACTOR_AUTH_CODE_LENGTH}
                />
            </div>
            <Button
                variant="confirm"
                onPress={handleConfirmApp2FA}
                isDisabled={isConfirming || code.length !== TWO_FACTOR_AUTH_CODE_LENGTH}
            >
                {t("authentication.2fa.enable.modal.submitButton.label")}
            </Button>
        </div>
    );
};

// TODO: Resend button
export const EmailTwoFactorAuthenticationEnablePrompt = ({ onEnabled }: { onEnabled: () => void }) => {
    const [code, setCode] = useState("");
    const { mutateAsync: confirmEmail2FA, isPending: isConfirming } = useConfirm2FAMethod();
    const t = useTranslate();
    const { onConfirm2FAMethodSuccess, onConfirm2FAMethodError } = useConfirm2FAMethodEvents();

    const handleConfirmEmail2FA = async () => {
        try {
            await confirmEmail2FA({ method: "email", code });
            onConfirm2FAMethodSuccess();
            onEnabled();
        } catch (error) {
            onConfirm2FAMethodError(error);
        }
    };

    return (
        <div className={styles.container}>
            {t("authentication.2fa.enable.modal.methods.email.description")}
            <div className={styles.inputWrapper}>
                <Button>{t("authentication.2fa.enable.modal.resendButton.label")}</Button>
                <CodeInput
                    label={t("authentication.2fa.enable.modal.codeInput.label")}
                    value={code}
                    onChange={setCode}
                    length={TWO_FACTOR_AUTH_CODE_LENGTH}
                />
            </div>

            <Button
                variant="confirm"
                onPress={handleConfirmEmail2FA}
                isDisabled={isConfirming || code.length !== TWO_FACTOR_AUTH_CODE_LENGTH}
            >
                {t("authentication.2fa.enable.modal.submitButton.label")}
            </Button>
        </div>
    );
};
