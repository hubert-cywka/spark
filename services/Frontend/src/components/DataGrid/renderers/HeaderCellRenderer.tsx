import { RenderHeaderCellProps } from "react-data-grid";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

import styles from "./styles/HeaderCellRenderer.module.scss";

import { Icon } from "@/components/Icon";

export function HeaderCellRenderer<TData>(p: RenderHeaderCellProps<TData>) {
    return (
        <div className={styles.container}>
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
