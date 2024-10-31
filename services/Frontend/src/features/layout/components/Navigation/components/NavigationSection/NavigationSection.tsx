import { PropsWithChildren } from "react";

import styles from "./styles/NavigationSection.module.scss";

type NavigationSectionProps = PropsWithChildren<{ label: string }>;

export const NavigationSection = ({ children, label }: NavigationSectionProps) => {
    return (
        <div className={styles.navigationSection}>
            <p className={styles.label}>{label}</p>
            <ul className={styles.navigationItems}>{children}</ul>
        </div>
    );
};
