import { DownloadIcon, XIcon } from "lucide-react";

import styles from "./styles/ExportEntryItem.module.scss";

import { Card } from "@/components/Card";
import { IconButton } from "@/components/IconButton";
import { useAccessValidation } from "@/features/auth/hooks";
import { DataExportStatusBadge } from "@/features/export/components/DataExportStatusBadge/DataExportStatusBadge.tsx";
import { useCancelExport } from "@/features/export/hooks/useCancelExport.ts";
import { useCancelExportEvents } from "@/features/export/hooks/useCancelExportEvents.ts";
import { useRequestExportFiles } from "@/features/export/hooks/useRequestExportFiles.ts";
import { useRequestExportFilesEvents } from "@/features/export/hooks/useRequestExportFilesEvents.ts";
import { DataExportEntry } from "@/features/export/types/DataExport";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type ExportEntryItemProps = {
    entry: DataExportEntry;
};

export const ExportEntryItem = ({ entry }: ExportEntryItemProps) => {
    const t = useTranslate();

    const { ensureAccess } = useAccessValidation();
    const { mutateAsync: cancelExport, isPending: isCancelling } = useCancelExport();
    const { onCancelExportError, onCancelExportSuccess } = useCancelExportEvents();

    const { mutateAsync: requestExportFiles, isPending: isRequestingFiles } = useRequestExportFiles();
    const { onRequestError } = useRequestExportFilesEvents();

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

    const handleRequestExportFiles = async (exportId: string) => {
        try {
            await requestExportFiles(exportId);
        } catch (error) {
            onRequestError(error);
        }
    };

    return (
        <Card as="li" key={entry.id} size="1" className={styles.card}>
            <div className={styles.content}>
                <div className={styles.info}>
                    <DataExportStatusBadge status={entry.status} />
                    <p className={styles.timestamp}>{t("exports.list.item.startedAt", { date: entry.startedAt.toLocaleString() })}</p>
                </div>

                {entry.status === "pending" && (
                    <IconButton
                        aria-label={t("exports.list.buttons.cancel.label")}
                        tooltip={t("exports.list.buttons.cancel.label")}
                        variant="subtle"
                        onClick={() => handleCancelExport(entry.id)}
                        isLoading={isCancelling}
                        iconSlot={XIcon}
                    />
                )}

                {entry.status === "completed" && (
                    <IconButton
                        aria-label={t("exports.list.buttons.download.label")}
                        tooltip={t("exports.list.buttons.download.label")}
                        variant="subtle"
                        onClick={() => handleRequestExportFiles(entry.id)}
                        isLoading={isRequestingFiles}
                        iconSlot={DownloadIcon}
                    />
                )}
            </div>

            <ul className={styles.scopeList}>
                {entry.targetScopes.map(({ domain, dateRange }) => (
                    <li key={domain}>
                        <strong>{t(`exports.common.scope.domains.${domain}`)}</strong>, from {dateRange.from}, to {dateRange.to}
                    </li>
                ))}
            </ul>
        </Card>
    );
};
