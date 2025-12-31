"use client";

import { useState } from "react";

import styles from "./styles/StartExportModal.module.scss";

import { Button } from "@/components/Button";
import { Modal, ModalHeader } from "@/components/Modal";
import { ModalBody } from "@/components/Modal/components/ModalBody/ModalBody";
import { ModalFooter } from "@/components/Modal/components/ModalFooter/ModalFooter";
import { ModalTrigger } from "@/components/Modal/types/Modal";
import { useAccessValidation } from "@/features/auth/hooks";
import { AddExportScopeForm } from "@/features/export/components/AddExportScopeForm/AddExportScopeForm.tsx";
import { ExportScopesList } from "@/features/export/components/ExportScopesList/ExportScopesList.tsx";
import { useStartExport } from "@/features/export/hooks/useStartExport.ts";
import { useStartExportEvents } from "@/features/export/hooks/useStartExportEvents.ts";
import { DataExportScope, DataExportScopeDomain } from "@/features/export/types/DataExport";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

type StartExportModalProps = {
    trigger: ModalTrigger;
};

export const StartExportModal = ({ trigger }: StartExportModalProps) => {
    const t = useTranslate();
    const [isOpen, setIsOpen] = useState(false);
    const [scopes, setScopes] = useState<DataExportScope[]>([]);
    const isAnyScopeSelected = scopes.length > 0;

    const { ensureAccess } = useAccessValidation();
    const { mutateAsync: startExport, isPending: isStarting } = useStartExport();
    const { onStartExportError, onStartExportSuccess } = useStartExportEvents();

    const handleStartExport = async (scopes: DataExportScope[]) => {
        if (!ensureAccess(["write:account"])) {
            return false;
        }

        try {
            await startExport({ targetScopes: scopes });
            onStartExportSuccess();
            return true;
        } catch (error) {
            onStartExportError(error);
            return false;
        }
    };

    const close = () => {
        setIsOpen(false);
        setScopes([]);
    };

    const addScope = (scope: DataExportScope) => {
        setScopes([...scopes, scope]);
    };

    const removeScope = (domain: DataExportScopeDomain) => {
        setScopes(scopes.filter((s) => s.domain !== domain));
    };

    const handleOnSubmit = async () => {
        const result = await handleStartExport(scopes);

        if (result) {
            close();
        }
    };

    return (
        <Modal trigger={trigger({ onClick: () => setIsOpen(true) })} isOpen={isOpen} onOpenChange={setIsOpen}>
            <ModalHeader onClose={close}>{t("exports.start.modal.header")}</ModalHeader>

            <ModalBody>
                <div className={styles.container}>
                    <p className={styles.description}>{t("exports.start.modal.description")}</p>
                    <ExportScopesList scopes={scopes} onRemoveScope={removeScope} />
                    <AddExportScopeForm scopes={scopes} onAddScope={addScope} />
                </div>
            </ModalBody>

            <ModalFooter>
                <Button variant="secondary" onPress={close}>
                    {t("exports.start.modal.buttons.cancel.label")}
                </Button>
                <Button variant="confirm" onPress={handleOnSubmit} isDisabled={!isAnyScopeSelected} isLoading={isStarting}>
                    {t("exports.start.modal.buttons.confirm.label")}
                </Button>
            </ModalFooter>
        </Modal>
    );
};
