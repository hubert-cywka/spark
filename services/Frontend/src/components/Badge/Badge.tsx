import classNames from "clsx";

import styles from "./styles/Badge.module.scss";

import { Icon } from "@/components/Icon";
import { IconSlot } from "@/components/Icon/types/Icon";
import { OverflowableText } from "@/components/OverflowableText";

type BadgeProps = {
    label: string;
    icon?: IconSlot;
    variant?: "primary" | "secondary" | "success" | "danger" | "info";
    className?: string;
};

export const Badge = ({ label, icon, className, variant = "primary" }: BadgeProps) => {
    return (
        <span data-variant={variant} className={classNames(styles.badge, className)}>
            {icon && <Icon className={styles.icon} slot={icon} size="1" />}
            <OverflowableText tooltip={label} className={styles.label}>
                {label}
            </OverflowableText>
        </span>
    );
};
