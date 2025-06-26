import { PropsWithChildren } from "react";
import { RenderGroupCellProps } from "react-data-grid";
import classNames from "clsx";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import styles from "./styles/GroupCellRenderer.module.scss";

import { IconButton } from "@/components/IconButton";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type GroupCellRendererProps<TData> = PropsWithChildren<RenderGroupCellProps<TData> & { className?: string }>;

export const GroupCellRenderer = <TData extends object>({
    isExpanded,
    children,
    className,
    row,
    toggleGroup,
}: GroupCellRendererProps<TData>) => {
    const t = useTranslate();

    const slot = isExpanded ? ChevronUpIcon : ChevronDownIcon;
    const labelTranslationKey = isExpanded ? "reports.grid.collapseGroupButton.label" : "reports.grid.expandGroupButton.label";

    return (
        <div className={classNames(styles.container, className)}>
            <div className={classNames(styles.valueWrapper)}>
                <span className={styles.count}>({row.childRows.length})</span>
                {children}
            </div>

            <IconButton
                size="1"
                variant="subtle"
                iconSlot={slot}
                onClick={toggleGroup}
                aria-label={t(labelTranslationKey)}
                className={styles.toggleButton}
            />
        </div>
    );
};
