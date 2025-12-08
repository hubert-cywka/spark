import { PropsWithChildren, ReactNode } from "react";
import { Menu as BaseMenu, MenuProps as BaseMenuProps, MenuTrigger, Popover } from "react-aria-components";

import styles from "./styles/Menu.module.scss";

type MenuProps<T> = Omit<BaseMenuProps<T>, "trigger"> & PropsWithChildren<{ trigger?: ReactNode }>;

export function Menu<T extends object>({ children, trigger, ...rest }: MenuProps<T>) {
    return (
        <MenuTrigger>
            {trigger}
            <Popover>
                <BaseMenu className={styles.dialog} {...rest}>
                    {children}
                </BaseMenu>
            </Popover>
        </MenuTrigger>
    );
}
