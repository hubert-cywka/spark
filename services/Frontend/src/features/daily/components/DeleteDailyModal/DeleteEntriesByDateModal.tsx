"use client";

import { Button } from "@/components/Button";
import { Modal, ModalHeader } from "@/components/Modal";
import { ModalBody } from "@/components/Modal/components/ModalBody/ModalBody";
import { ModalFooter } from "@/components/Modal/components/ModalFooter/ModalFooter";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { ISODateString } from "@/types/ISODateString";

type DeleteEntriesByDateModalProps = {
    date: ISODateString;
    onDelete: () => Promise<void>;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
};

export const DeleteEntriesByDateModal = ({ date, onDelete, isOpen, onOpenChange }: DeleteEntriesByDateModalProps) => {
    const t = useTranslate();

    const handleDelete = async () => {
        await onDelete();
        close();
    };

    const close = () => {
        onOpenChange(false);
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
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
