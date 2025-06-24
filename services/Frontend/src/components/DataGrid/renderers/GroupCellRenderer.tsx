import { PropsWithChildren } from "react";
import { RenderGroupCellProps } from "react-data-grid";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import styles from "./styles/GroupCellRenderer.module.scss";

import { IconButton } from "@/components/IconButton";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

export const GroupCellRenderer = <TData extends object>(p: PropsWithChildren<RenderGroupCellProps<TData>>) => {
    const t = useTranslate();

    const slot = p.isExpanded ? ChevronUpIcon : ChevronDownIcon;
    const label = p.isExpanded ? "reports.grid.collapseGroupButton.label" : "reports.grid.expandGroupButton.label";

    return (
        <div className={styles.container}>
            {p.children}
            <IconButton iconSlot={slot} size="1" variant="subtle" onClick={p.toggleGroup} aria-label={t(label)} />
        </div>
    );
};
