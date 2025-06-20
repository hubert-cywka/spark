import { RenderCellProps } from "react-data-grid";
import { StarIcon, StarOffIcon } from "lucide-react";

import { EntriesDataGridColumn, EntryRow } from "../types/EntriesDataGrid";

import styles from "./styles/IsFeaturedCellRenderer.module.scss";

import { Badge } from "@/components/Badge";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

export const IsFeaturedCellRenderer = (p: RenderCellProps<EntryRow>) => {
    const t = useTranslate();
    const value = p.row[p.column.key as EntriesDataGridColumn];

    return (
        <div className={styles.container}>
            {value ? (
                <Badge label={t("entries.values.featured")} icon={StarIcon} variant="secondary" />
            ) : (
                <Badge label={t("entries.values.notFeatured")} icon={StarOffIcon} />
            )}
        </div>
    );
};
