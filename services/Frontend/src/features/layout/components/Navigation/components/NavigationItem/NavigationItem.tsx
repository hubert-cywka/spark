import clsx from "clsx";

import styles from "./styles/NavigationItem.module.scss";

import { AppRoute } from "@/app/appRoute";
import { Anchor } from "@/components/Anchor/Anchor";
import { IconComponent } from "@/types/Icon";

type NavigationItemProps = {
    target: AppRoute;
    label: string;
    icon: IconComponent;
    isActive: boolean;
};

export const NavigationItem = ({ target, isActive, label, icon: Icon }: NavigationItemProps) => {
    return (
        <li className={styles.navigationItem}>
            <Anchor href={target} prefetch={false} className={clsx(styles.link, { [styles.active]: isActive })}>
                <Icon className={styles.icon} />
                {label}
            </Anchor>
        </li>
    );
};
