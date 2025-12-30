import { XIcon } from "lucide-react";

import styles from "./styles/ExportScopesList.module.scss";

import { IconButton } from "@/components/IconButton";
import { DataExportScope, DataExportScopeDomain } from "@/features/export/types/DataExport";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type ExportScopesListProps = {
    scopes: DataExportScope[];
    onRemoveScope: (domain: DataExportScopeDomain) => void;
};
export const ExportScopesList = ({ scopes, onRemoveScope }: ExportScopesListProps) => {
    const t = useTranslate();

    return (
        <ul className={styles.list}>
            {scopes.map((scope) => (
                <li key={scope.domain} className={styles.row}>
                    <span className={styles.domain}>{t(`exports.common.scope.domains.${scope.domain}`)}</span>

                    <span className={styles.timeframe}>
                        , {t("exports.common.scope.timeframe", { from: scope.dateRange.from, to: scope.dateRange.to })}
                    </span>

                    <div className={styles.actions}>
                        <IconButton
                            tooltip={t("exports.start.modal.buttons.removeScope.label")}
                            aria-label={t("exports.start.modal.buttons.removeScope.label")}
                            iconSlot={XIcon}
                            variant="subtle"
                            size="1"
                            onPress={() => onRemoveScope(scope.domain)}
                        />
                    </div>
                </li>
            ))}
        </ul>
    );
};
