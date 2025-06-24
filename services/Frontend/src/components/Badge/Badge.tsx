import styles from "./styles/Badge.module.scss";

import { Icon } from "@/components/Icon";
import { IconSlot } from "@/components/Icon/types/Icon";

type BadgeProps = {
    label: string;
    icon?: IconSlot;
    variant?: "primary" | "secondary" | "success" | "danger" | "info";
};

export const Badge = ({ label, icon, variant = "primary" }: BadgeProps) => {
    return (
        <span data-variant={variant} className={styles.badge}>
            {icon && <Icon slot={icon} size="1" />}
            {label}
        </span>
    );
};
