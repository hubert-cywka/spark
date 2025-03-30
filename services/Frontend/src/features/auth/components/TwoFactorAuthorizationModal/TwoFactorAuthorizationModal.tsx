"use client";

import { useState } from "react";

import styles from "./styles/TwoFactorAuthorizationModal.module.scss";

import { Button } from "@/components/Button";
import { CodeInput } from "@/components/Input/CodeInput.tsx";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "@/components/Modal";
import { useTwoFactorAuthorization } from "@/features/auth/hooks";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

const TWO_FACTOR_AUTH_OTP_LENGTH = 6;

export const TwoFactorAuthorizationModal = () => {
    const t = useTranslate();
    const [code, setCode] = useState<string>("");

    const { isAuthorizationInProgress, cancelAuthorizationProcess } = useTwoFactorAuthorization();

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
