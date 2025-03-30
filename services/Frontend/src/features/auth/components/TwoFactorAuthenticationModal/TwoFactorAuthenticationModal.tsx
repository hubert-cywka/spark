"use client";

import { useEffect, useState } from "react";

import styles from "./styles/TwoFactorAuthenticationModal.module.scss";

import { Button } from "@/components/Button";
import { CodeInput } from "@/components/Input/CodeInput.tsx";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "@/components/Modal";
import { useTwoFactorAuthentication } from "@/features/auth/hooks";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

const TWO_FACTOR_AUTH_OTP_LENGTH = 6;
const RESEND_DELAY = 60;

export const TwoFactorAuthenticationModal = () => {
    const t = useTranslate();
    const [code, setCode] = useState<string>("");
    const [resendTimer, setResendTimer] = useState<number>(0);

    const { isAuthorizationInProgress, cancelAuthorizationProcess } = useTwoFactorAuthentication();

    const handleResendCode = async () => {
        // TODO: Request code from backend
        setResendTimer(RESEND_DELAY);
    };

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setInterval(() => {
                setResendTimer((prevTimer) => prevTimer - 1);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [resendTimer]);

    const formatTime = (seconds: number) => {
        if (seconds <= 0) {
            return t("authorization.2fa.modal.resendButton.label");
        }

        return `${t("authorization.2fa.modal.resendButton.label")} (${seconds}s)`;
    };

    return (
        <Modal isOpen={isAuthorizationInProgress}>
            <ModalHeader onClose={cancelAuthorizationProcess}>{t("authorization.2fa.modal.header")}</ModalHeader>

            <ModalBody>
                {t("authorization.2fa.modal.description")}

                <CodeInput
                    className={styles.codeInput}
                    label={t("authorization.2fa.modal.codeInput.label")}
                    onChange={setCode}
                    value={code}
                    length={TWO_FACTOR_AUTH_OTP_LENGTH}
                />
            </ModalBody>

            <ModalFooter>
                {/* TODO: Display only if email 2FA is enabled */}
                <Button className={styles.sendViaEmailButton} isDisabled={resendTimer > 0} onPress={handleResendCode}>
                    {formatTime(resendTimer)}
                </Button>

                <Button variant="secondary" onPress={cancelAuthorizationProcess}>
                    {t("authorization.2fa.modal.cancelButton.label")}
                </Button>
                <Button variant="confirm" isDisabled={code.length !== TWO_FACTOR_AUTH_OTP_LENGTH}>
                    {t("authorization.2fa.modal.submitButton.label")}
                </Button>
            </ModalFooter>
        </Modal>
    );
};
