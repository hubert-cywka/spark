import { RenderHeaderCellProps } from "react-data-grid";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

import styles from "./styles/HeaderCellRenderer.module.scss";

import { Icon } from "@/components/Icon";

export function HeaderCellRenderer<TData>(p: RenderHeaderCellProps<TData>) {
    return (
        <div className={styles.container}>
            <div className={styles.name}>{p.column.name}</div>

            {p.column.sortable && (
                <div>
                    {p.sortDirection === "ASC" && <Icon slot={ArrowDownIcon} size="1" />}
                    {p.sortDirection === "DESC" && <Icon slot={ArrowUpIcon} size="1" />}
                </div>
            )}
        </div>
    );
}
