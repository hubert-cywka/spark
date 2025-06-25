import { RenderHeaderCellProps } from "react-data-grid";
import classNames from "clsx";
import { ArrowDownIcon, ArrowUpIcon, GroupIcon } from "lucide-react";

import styles from "./styles/HeaderCellRenderer.module.scss";

import { Icon } from "@/components/Icon";
import { IconButton } from "@/components/IconButton";
import { OverflowableText } from "@/components/OverflowableText";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type HeaderCellRendererProps<TData> = RenderHeaderCellProps<TData> & {
    canBeGrouped: boolean;
    isGrouped: boolean;
    group: () => void;
    ungroup: () => void;
};

export function HeaderCellRenderer<TData>({
    column,
    isGrouped,
    canBeGrouped,
    sortDirection,
    group,
    ungroup,
}: HeaderCellRendererProps<TData>) {
    const t = useTranslate();

    const columnName = column.name as string;
    const groupButtonLabel = isGrouped ? "reports.grid.ungroupButton.label" : "reports.grid.groupButton.label";
    const handleGroupClick = isGrouped ? ungroup : group;

    return (
        <div className={styles.container}>
            {canBeGrouped && (
                <IconButton
                    onPress={handleGroupClick}
                    iconSlot={GroupIcon}
                    aria-label={t(groupButtonLabel, { columnName })}
                    className={classNames(styles.groupingButton, {
                        [styles.grouped]: isGrouped,
                    })}
                    variant="subtle"
                    size="1"
                />
            )}

            <OverflowableText tooltip={columnName} className={styles.name}>
                {columnName}
            </OverflowableText>

            {column.sortable && (
                <span className={styles.sortButton}>
                    {sortDirection === "ASC" && <Icon slot={ArrowDownIcon} size="1" />}
                    {sortDirection === "DESC" && <Icon slot={ArrowUpIcon} size="1" />}
                </span>
            )}
        </div>
    );
}
