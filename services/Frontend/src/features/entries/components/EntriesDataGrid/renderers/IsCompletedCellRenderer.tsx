import { RenderCellProps } from "react-data-grid";
import { SquareCheckIcon, SquareIcon } from "lucide-react";

import { EntryRow } from "../types/EntriesDataGrid";

import styles from "./styles/IsCompletedCellRenderer.module.scss";

import { Badge } from "@/components/Badge";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type IsCompletedCellValueRendererProps = {
    value: boolean;
};

const IsCompletedCellValueRenderer = ({ value }: IsCompletedCellValueRendererProps) => {
    const t = useTranslate();

    return value ? (
        <Badge label={t("entries.values.completed")} icon={SquareCheckIcon} variant="success" className={styles.badge} />
    ) : (
        <Badge label={t("entries.values.pending")} icon={SquareIcon} className={styles.badge} />
    );
};

export const IsCompletedCellRenderer = (p: RenderCellProps<EntryRow>) => {
    return <IsCompletedCellValueRenderer value={p.row.isCompleted} />;
};
