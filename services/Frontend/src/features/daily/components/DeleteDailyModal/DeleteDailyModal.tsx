"use client";

import { useState } from "react";

import { Button } from "@/components/Button";
import { Modal, ModalHeader } from "@/components/Modal";
import { ModalBody } from "@/components/Modal/components/ModalBody/ModalBody";
import { ModalFooter } from "@/components/Modal/components/ModalFooter/ModalFooter";
import { ModalTrigger } from "@/components/Modal/types/Modal";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { ISODateString } from "@/types/ISODateString";

type RemoveDailyModalProps = {
    date: ISODateString;
    onDelete: () => void;
    trigger: ModalTrigger;
};

export const DeleteDailyModal = ({ trigger, date, onDelete }: RemoveDailyModalProps) => {
    const t = useTranslate();
    const [isOpen, setIsOpen] = useState(false);

    const close = () => {
        setIsOpen(false);
    };

    return (
        <Modal trigger={trigger({ onClick: () => setIsOpen(true) })} isOpen={isOpen} onOpenChange={setIsOpen}>
            <ModalHeader onClose={close}>{t("daily.delete.modal.header")}</ModalHeader>

            <ModalBody>
                <p>{t("daily.delete.modal.caption", { date })}</p>
            </ModalBody>

            <ModalFooter>
                <Button variant="secondary" onPress={close}>
                    {t("daily.delete.modal.buttons.cancel.label")}
                </Button>
                <Button variant="danger" onPress={onDelete}>
                    {t("daily.delete.modal.buttons.confirm.label")}
                </Button>
            </ModalFooter>
        </Modal>
    );
};
