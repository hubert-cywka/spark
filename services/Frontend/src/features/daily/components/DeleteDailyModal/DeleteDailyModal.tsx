"use client";

import { useState } from "react";

import { Button } from "@/components/Button";
import { Modal, ModalHeader } from "@/components/Modal";
import { ModalBody } from "@/components/Modal/components/ModalBody/ModalBody";
import { ModalFooter } from "@/components/Modal/components/ModalFooter/ModalFooter";
import { ModalTrigger } from "@/components/Modal/types/Modal";
import { useDeleteDaily } from "@/features/daily/hooks/useDeleteDaily";
import { useDeleteDailyEvents } from "@/features/daily/hooks/useDeleteDailyEvents";
import { Daily } from "@/features/daily/types/Daily";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

type RemoveDailyModalProps = {
    daily: Daily;
    trigger: ModalTrigger;
};

export const DeleteDailyModal = ({ daily, trigger }: RemoveDailyModalProps) => {
    const t = useTranslate();
    const [isOpen, setIsOpen] = useState(false);

    const { mutateAsync: deleteDaily } = useDeleteDaily();
    const { onDeleteDailySuccess, onDeleteDailyError } = useDeleteDailyEvents();

    const handleDeleteDaily = async () => {
        try {
            await deleteDaily(daily.id);
            onDeleteDailySuccess();
        } catch (err) {
            onDeleteDailyError(err);
        }
    };

    const close = () => {
        setIsOpen(false);
    };

    return (
        <Modal trigger={trigger({ onClick: () => setIsOpen(true) })} isOpen={isOpen} onOpenChange={setIsOpen}>
            <ModalHeader onClose={close}>{t("daily.delete.modal.header")}</ModalHeader>

            <ModalBody>
                <p>{t("daily.delete.modal.caption", { date: daily.date })}</p>
            </ModalBody>

            <ModalFooter>
                <Button variant="secondary" onPress={close}>
                    {t("daily.delete.modal.buttons.cancel.label")}
                </Button>
                <Button variant="danger" onPress={handleDeleteDaily}>
                    {t("daily.delete.modal.buttons.confirm.label")}
                </Button>
            </ModalFooter>
        </Modal>
    );
};
