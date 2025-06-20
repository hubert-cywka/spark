import { RenderCellProps, RenderGroupCellProps } from "react-data-grid";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { EntryRow } from "../types/EntriesDataGrid";

import styles from "./styles/DailyDateCellRenderer.module.scss";

import { IconButton } from "@/components/IconButton";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

export const DailyDateCellRenderer = (p: RenderCellProps<EntryRow>) => {
    return <div className={styles.container}>{p.row.daily}</div>;
};

export const DailyDateGroupCellRenderer = (p: RenderGroupCellProps<EntryRow>) => {
    const t = useTranslate();

    const slot = p.isExpanded ? ChevronUpIcon : ChevronDownIcon;
    const label = p.isExpanded ? "reports.grid.collapseGroupButton.label" : "reports.grid.expandGroupButton.label";

    return (
        <div className={styles.container}>
            {p.row.childRows[0].daily}
            <IconButton iconSlot={slot} size="1" variant="subtle" onClick={p.toggleGroup} aria-label={t(label)} />
        </div>
    );
};
