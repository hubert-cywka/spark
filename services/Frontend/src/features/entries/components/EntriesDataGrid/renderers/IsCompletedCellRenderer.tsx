import { RenderCellProps } from "react-data-grid";
import { SquareCheckIcon, SquareIcon } from "lucide-react";

import { EntryRow } from "../types/EntriesDataGrid";

import styles from "./styles/IsCompletedCellRenderer.module.scss";

import { Badge } from "@/components/Badge";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

export const IsCompletedCellRenderer = (p: RenderCellProps<EntryRow>) => {
    const t = useTranslate();

    return p.row.isCompleted ? (
        <Badge label={t("entries.values.completed")} icon={SquareCheckIcon} variant="success" className={styles.badge} />
    ) : (
        <Badge label={t("entries.values.pending")} icon={SquareIcon} className={styles.badge} />
    );
};
