import { useState } from "react";

import { Button } from "@/components/Button";
import { DatePicker } from "@/components/Input";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "@/components/Modal";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";
import { ISODateString } from "@/types/ISODateString";

type UpdateEntryDateModalProps = {
    defaultDate: ISODateString;
    onUpdate: (date: ISODateString) => Promise<unknown>;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
};
export const UpdateEntryDateModal = ({ defaultDate, onUpdate, isOpen, onOpenChange }: UpdateEntryDateModalProps) => {
    const t = useTranslate();
    const [date, setDate] = useState<ISODateString>(defaultDate);

    const handleUpdate = async () => {
        await onUpdate(date);
        close();
    };

    const close = () => {
        onOpenChange(false);
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalHeader onClose={close}>{t("entries.changeDate.modal.header")}</ModalHeader>

            <ModalBody>
                <DatePicker label={t("entries.changeDate.modal.caption")} value={date} onChange={setDate} />
            </ModalBody>

            <ModalFooter>
                <Button variant="secondary" onPress={close}>
                    {t("entries.changeDate.modal.buttons.cancel.label")}
                </Button>
                <Button variant="confirm" onPress={handleUpdate}>
                    {t("entries.changeDate.modal.buttons.confirm.label")}
                </Button>
            </ModalFooter>
        </Modal>
    );
};
