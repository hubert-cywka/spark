import { MenuItem as BaseMenuItem, MenuItemProps as BaseMenuItemProps } from "react-aria-components";
import classNames from "clsx";

import styles from "./styles/MenuItem.module.scss";

type MenuItemProps = BaseMenuItemProps;

export function MenuItem({ children, className, ...rest }: MenuItemProps) {
    return (
        <BaseMenuItem className={classNames(styles.menuItem, className)} {...rest}>
            {children}
        </BaseMenuItem>
    );
}
