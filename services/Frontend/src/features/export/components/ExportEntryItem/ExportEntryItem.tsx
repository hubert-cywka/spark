import { XIcon } from "lucide-react";

import styles from "./styles/ExportEntryItem.module.scss";

import { Card } from "@/components/Card";
import { IconButton } from "@/components/IconButton";
import { DataExportStatusBadge } from "@/features/export/components/DataExportStatusBadge/DataExportStatusBadge.tsx";
import { DataExportEntry } from "@/features/export/types/DataExport";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type ExportEntryItemProps = {
    entry: DataExportEntry;
    onCancel: (entryId: string) => void;
};

export const ExportEntryItem = ({ entry, onCancel }: ExportEntryItemProps) => {
    const t = useTranslate();

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
                        onClick={() => onCancel(entry.id)}
                        iconSlot={XIcon}
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
