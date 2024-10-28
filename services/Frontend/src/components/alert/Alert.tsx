import { useMemo } from "react";
import { IconAlertTriangle, IconCircleCheck, IconInfoCircle, IconMessageCircle } from "@tabler/icons-react";

import styles from "./styles/Alert.module.scss";

import { AlertProps } from "@/components/alert/types/Alert";

export const Alert = ({ children, variant }: AlertProps) => {
    const Icon = useMemo(() => {
        switch (variant) {
            case "success":
                return IconCircleCheck;
            case "danger":
                return IconAlertTriangle;
            case "info":
                return IconInfoCircle;
            case "neutral":
                return IconMessageCircle;
        }
    }, [variant]);

    return (
        <div data-variant={variant} className={styles.container}>
            <div className={styles.iconWrapper}>
                <Icon />
            </div>
            <p className={styles.message}>{children}</p>
        </div>
    );
};
