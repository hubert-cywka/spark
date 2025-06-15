import styles from "./styles/NavigationItem.module.scss";

import { AppRoute } from "@/app/appRoute.ts";
import { Anchor } from "@/components/Anchor";

type NavigationItemProps = {
    href: AppRoute;
    label: string;
};

export const NavigationItem = ({ href, label }: NavigationItemProps) => {
    return (
        <Anchor href={href} className={styles.navigationItem}>
            {label}
        </Anchor>
    );
};
