import { MenuItem as BaseMenuItem, MenuItemProps as BaseMenuItemProps } from "react-aria-components";
import classNames from "clsx";

import styles from "./styles/MenuItem.module.scss";

import { Icon } from "@/components/Icon";
import { IconSlot } from "@/components/Icon/types/Icon";

type MenuItemProps = Omit<BaseMenuItemProps, "children"> & {
    label: string;
    iconSlot: IconSlot;
    variant?: "danger" | "neutral";
};

export function MenuItem({ className, label, iconSlot, variant = "neutral", ...rest }: MenuItemProps) {
    return (
        <BaseMenuItem data-variant={variant} className={classNames(styles.menuItem, className)} {...rest}>
            <span className={styles.itemLabel}>{label}</span> <Icon className={styles.icon} slot={iconSlot} size="1" />
        </BaseMenuItem>
    );
}
