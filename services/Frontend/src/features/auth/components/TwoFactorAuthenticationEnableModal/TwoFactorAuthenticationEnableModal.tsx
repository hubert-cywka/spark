import { ReactNode } from "react";

import { Button } from "@/components/Button";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "@/components/Modal";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type TwoFactorAuthenticationEnableModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
};

export const TwoFactorAuthenticationEnableModal = ({ isOpen, onClose, children }: TwoFactorAuthenticationEnableModalProps) => {
    const t = useTranslate();

    return (
        <Modal isOpen={isOpen}>
            <ModalHeader onClose={onClose}>{t("authentication.2fa.enable.modal.title")}</ModalHeader>
            <ModalBody>{children}</ModalBody>

            <ModalFooter>
                <Button variant="secondary" onPress={onClose}>
                    {t("authentication.2fa.enable.modal.cancelButton.label")}
                </Button>
            </ModalFooter>
        </Modal>
    );
};
