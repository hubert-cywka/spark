import { useMemo } from "react";
import { CircleAlert, CircleCheck, Info, MessageCircle } from "lucide-react";

import { AlertProps } from "./types/Alert";

import styles from "./styles/Alert.module.scss";

export const Alert = ({ children, variant }: AlertProps) => {
    const Icon = useMemo(() => {
        switch (variant) {
            case "success":
                return CircleCheck;
            case "danger":
                return CircleAlert;
            case "info":
                return Info;
            case "neutral":
                return MessageCircle;
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
