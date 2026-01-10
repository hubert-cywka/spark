import { UpdateEntryDateInputs, useUpdateEntryDateForm } from "./hooks/useUpdateEntryDateForm";

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

    const {
        handleSubmit,
        setValue,
        watch,
        formState: { isSubmitting },
    } = useUpdateEntryDateForm({ defaultDate });

    const dateValue = watch("date");

    const close = () => {
        onOpenChange(false);
    };

    const internalOnSubmit = async ({ date }: UpdateEntryDateInputs) => {
        await onUpdate(date);
        close();
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <form onSubmit={handleSubmit(internalOnSubmit)}>
                <ModalHeader onClose={close}>{t("entries.changeDate.modal.header")}</ModalHeader>

                <ModalBody>
                    <DatePicker
                        autoFocus
                        label={t("entries.changeDate.modal.caption")}
                        value={dateValue}
                        onChange={(value) => setValue("date", value)}
                    />
                </ModalBody>

                <ModalFooter>
                    <Button variant="secondary" onPress={close}>
                        {t("entries.changeDate.modal.buttons.cancel.label")}
                    </Button>
                    <Button variant="confirm" type="submit" isLoading={isSubmitting}>
                        {t("entries.changeDate.modal.buttons.confirm.label")}
                    </Button>
                </ModalFooter>
            </form>
        </Modal>
    );
};
