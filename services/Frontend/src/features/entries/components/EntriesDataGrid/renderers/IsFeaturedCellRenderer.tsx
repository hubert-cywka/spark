import { RenderCellProps } from "react-data-grid";
import { StarIcon, StarOffIcon } from "lucide-react";

import { EntryRow } from "../types/EntriesDataGrid";

import styles from "./styles/IsFeaturedCellRenderer.module.scss";

import { Badge } from "@/components/Badge";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

export const IsFeaturedCellRenderer = (p: RenderCellProps<EntryRow>) => {
    const t = useTranslate();

    return p.row.isFeatured ? (
        <Badge label={t("entries.values.featured")} icon={StarIcon} variant="secondary" className={styles.badge} />
    ) : (
        <Badge label={t("entries.values.notFeatured")} icon={StarOffIcon} className={styles.badge} />
    );
};
