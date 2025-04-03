import React, { useCallback, useState } from "react";
import QRCode from "react-qr-code";

import styles from "./styles/TwoFactorAuthenticationEnableModal.module.scss";

import { Button } from "@/components/Button";
import { ButtonWithThrottle } from "@/components/ButtonWithThrottle";
import { CodeInput } from "@/components/Input";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "@/components/Modal";
import { TWO_FACTOR_AUTH_CODE_LENGTH } from "@/features/auth/constants";
import { useConfirm2FAMethod } from "@/features/auth/hooks/2fa/useConfirm2FAMethod.ts";
import { useConfirm2FAMethodEvents } from "@/features/auth/hooks/2fa/useConfirm2FAMethodEvents.ts";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

const RESEND_DELAY = 60;
const QR_CODE_SIZE = 200;

type TwoFactorAuthenticationEnableModalProps = {
    isOpen: boolean;
    onClose: () => void;
    method: "email" | "app";
    onResendCode?: () => void;
    canResendCode?: boolean;
    url?: string;
};

export const TwoFactorAuthenticationEnableModal = ({
    isOpen,
    onClose,
    method,
    onResendCode,
    canResendCode = false,
    url,
}: TwoFactorAuthenticationEnableModalProps) => {
    const t = useTranslate();
    const [code, setCode] = useState("");
    const { mutateAsync: confirm2FAMethod, isPending: isConfirming } = useConfirm2FAMethod();
    const { onConfirm2FAMethodSuccess, onConfirm2FAMethodError } = useConfirm2FAMethodEvents();

    const handleConfirm = useCallback(async () => {
        if (code.length !== TWO_FACTOR_AUTH_CODE_LENGTH) {
            return;
        }

        try {
            await confirm2FAMethod({ method, code });
            onConfirm2FAMethodSuccess();
            setCode("");
            onClose();
        } catch (error) {
            onConfirm2FAMethodError(error);
        }
    }, [code, confirm2FAMethod, method, onClose, onConfirm2FAMethodError, onConfirm2FAMethodSuccess]);

    const formatResendButtonLabel = useCallback(
        (seconds: number) => {
            if (seconds > 0) {
                return `${t("authentication.2fa.enable.modal.resendButton.label")} (${seconds}s)`;
            }
            return t("authentication.2fa.enable.modal.resendButton.label");
        },
        [t]
    );

    const description =
        method === "email"
            ? t("authentication.2fa.enable.modal.methods.email.description")
            : t("authentication.2fa.enable.modal.methods.app.description");

    return (
        <Modal isOpen={isOpen}>
            <ModalHeader onClose={onClose}>{t("authentication.2fa.enable.modal.title")}</ModalHeader>

            <ModalBody>
                <div className={styles.container}>
                    {description}

                    {method === "app" && (
                        <>
                            <b className={styles.warning}>{t("authentication.2fa.enable.modal.methods.app.warning")}</b>
                            <div className={styles.qrCodeWrapper}>{url && <QRCode value={url} size={QR_CODE_SIZE} />}</div>
                        </>
                    )}

                    <div className={styles.inputWrapper}>
                        <CodeInput
                            label={t("authentication.2fa.enable.modal.codeInput.label")}
                            value={code}
                            onChange={setCode}
                            onSubmit={handleConfirm}
                            length={TWO_FACTOR_AUTH_CODE_LENGTH}
                        />

                        {onResendCode && (
                            <ButtonWithThrottle
                                variant="link"
                                throttle={RESEND_DELAY}
                                label={formatResendButtonLabel}
                                onPress={onResendCode}
                                isDisabled={!canResendCode}
                            />
                        )}
                    </div>
                </div>
            </ModalBody>

            <ModalFooter>
                <Button variant="secondary" onPress={onClose}>
                    {t("authentication.2fa.enable.modal.cancelButton.label")}
                </Button>

                <Button variant="confirm" onPress={handleConfirm} isDisabled={isConfirming || code.length !== TWO_FACTOR_AUTH_CODE_LENGTH}>
                    {t("authentication.2fa.enable.modal.submitButton.label")}
                </Button>
            </ModalFooter>
        </Modal>
    );
};
