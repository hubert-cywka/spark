import { RenderHeaderCellProps } from "react-data-grid";
import { ArrowDownIcon, ArrowUpIcon, GroupIcon, UngroupIcon } from "lucide-react";

import styles from "./styles/HeaderCellRenderer.module.scss";

import { Icon } from "@/components/Icon";
import { IconButton } from "@/components/IconButton";

type HeaderCellRendererProps<TData> = RenderHeaderCellProps<TData> & {
    canBeGrouped: boolean;
    isGrouped: boolean;
    group: () => void;
    ungroup: () => void;
};

export function HeaderCellRenderer<TData>(p: HeaderCellRendererProps<TData>) {
    const handleGroupClick = p.isGrouped ? p.ungroup : p.group;
    const groupIcon = p.isGrouped ? UngroupIcon : GroupIcon;

    return (
        <div className={styles.container}>
            {p.canBeGrouped && (
                <IconButton
                    onPress={handleGroupClick}
                    iconSlot={groupIcon}
                    aria-label="TODO"
                    className={styles.groupingButton}
                    variant="subtle"
                    size="1"
                />
            )}

            <span className={styles.name}>{p.column.name}</span>

            {p.column.sortable && (
                <span>
                    {p.sortDirection === "ASC" && <Icon slot={ArrowDownIcon} size="1" />}
                    {p.sortDirection === "DESC" && <Icon slot={ArrowUpIcon} size="1" />}
                </span>
            )}
        </div>
    );
}
