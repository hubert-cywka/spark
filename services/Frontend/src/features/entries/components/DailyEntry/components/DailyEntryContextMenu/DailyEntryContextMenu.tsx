import { PropsWithChildren } from "react";
import classNames from "clsx";
import { TrashIcon } from "lucide-react";

import styles from "./styles/DailyEntryContextMenu.module.scss";

import { Icon } from "@/components/Icon";
import { Menu, MenuItem } from "@/components/Menu";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type DailyEntryContextMenuProps = PropsWithChildren<{
    onDelete: () => unknown;
}>;

export const DailyEntryContextMenu = ({ children, onDelete }: DailyEntryContextMenuProps) => {
    const t = useTranslate();

    return (
        <Menu trigger={children}>
            <MenuItem onAction={onDelete} className={classNames(styles.item, styles.danger)}>
                <span className={styles.itemLabel}>{t("entries.actionsMenu.actions.delete")}</span> <Icon slot={TrashIcon} size="1" />
            </MenuItem>
        </Menu>
    );
};
