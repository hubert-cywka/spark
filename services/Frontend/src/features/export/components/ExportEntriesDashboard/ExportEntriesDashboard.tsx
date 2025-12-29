"use client";

import styles from "./styles/ExportEntriesDashboard.module.scss";

import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { useAccessValidation } from "@/features/auth/hooks";
import { ExportEntriesList } from "@/features/export/components/ExportEntriesList/ExportEntriesList.tsx";
import { ExportEntriesListSkeleton } from "@/features/export/components/ExportEntriesList/ExportEntriesListSkeleton.tsx";
import { StartExportModal } from "@/features/export/components/StartExportModal/StartExportModal.tsx";
import { useCancelExport } from "@/features/export/hooks/useCancelExport.ts";
import { useCancelExportEvents } from "@/features/export/hooks/useCancelExportEvents.ts";
import { useRecentDataExportEntries } from "@/features/export/hooks/useRecentDataExportEntries.ts";
import { useStartExport } from "@/features/export/hooks/useStartExport.ts";
import { useStartExportEvents } from "@/features/export/hooks/useStartExportEvents.ts";
import { DataExportScope } from "@/features/export/types/DataExport";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

export const ExportEntriesDashboard = () => {
    const t = useTranslate();

    const { data: exportEntries, isLoading } = useRecentDataExportEntries();
    const { mutateAsync: startExport } = useStartExport();
    const { mutateAsync: cancelExport } = useCancelExport();
    const { ensureAccess } = useAccessValidation();

    const { onStartExportError, onStartExportSuccess } = useStartExportEvents();
    const { onCancelExportError, onCancelExportSuccess } = useCancelExportEvents();

    const isAnotherExportActive = isLoading || !!exportEntries?.find((entry) => entry.status === "pending");

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

    const handleCancelExport = async (exportId: string) => {
        if (!ensureAccess(["write:account"])) {
            return;
        }

        try {
            await cancelExport(exportId);
            onCancelExportSuccess();
        } catch (error) {
            onCancelExportError(error);
        }
    };

    return (
        <article className={styles.container}>
            {isLoading && <ExportEntriesListSkeleton />}

            {!isLoading && !exportEntries?.length && <Alert variant="info">{t("exports.list.noData")}</Alert>}

            {!isLoading && !!exportEntries?.length && (
                <>
                    <p>{t("exports.list.header")}</p>
                    <ExportEntriesList entries={exportEntries} onCancel={handleCancelExport} />
                </>
            )}

            <StartExportModal
                onSubmit={handleStartExport}
                trigger={({ onClick }) => (
                    <Button onClick={onClick} isDisabled={isAnotherExportActive}>
                        {t("exports.list.buttons.start.label")}
                    </Button>
                )}
            />
        </article>
    );
};
