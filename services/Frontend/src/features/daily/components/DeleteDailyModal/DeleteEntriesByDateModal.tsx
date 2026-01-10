"use client";

import { useState } from "react";

import { Button } from "@/components/Button";
import { Modal, ModalHeader } from "@/components/Modal";
import { ModalBody } from "@/components/Modal/components/ModalBody/ModalBody";
import { ModalFooter } from "@/components/Modal/components/ModalFooter/ModalFooter";
import { ModalTrigger } from "@/components/Modal/types/Modal";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { ISODateString } from "@/types/ISODateString";

type DeleteEntriesByDateModalProps = {
    date: ISODateString;
    onDelete: () => Promise<void>;
    trigger: ModalTrigger;
};

export const DeleteEntriesByDateModal = ({ trigger, date, onDelete }: DeleteEntriesByDateModalProps) => {
    const t = useTranslate();
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = async () => {
        await onDelete();
        close();
    };

    const close = () => {
        setIsOpen(false);
    };

    return (
        <Modal trigger={trigger({ onClick: () => setIsOpen(true) })} isOpen={isOpen} onOpenChange={setIsOpen}>
            <ModalHeader onClose={close}>{t("entries.deleteByDay.modal.header")}</ModalHeader>

            <ModalBody>
                <p>{t("entries.deleteByDay.modal.caption", { date })}</p>
            </ModalBody>

            <ModalFooter>
                <Button variant="secondary" onPress={close}>
                    {t("entries.deleteByDay.modal.buttons.cancel.label")}
                </Button>
                <Button variant="danger" onPress={handleDelete}>
                    {t("entries.deleteByDay.modal.buttons.confirm.label")}
                </Button>
            </ModalFooter>
        </Modal>
    );
};
