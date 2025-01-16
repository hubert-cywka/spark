import { X } from "lucide-react";

import { ToastProps } from "./types/Toast";

import styles from "./styles/Toast.module.scss";

import { Icon } from "@/components/Icon";
import { IconButton } from "@/components/IconButton";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

export const Toast = ({ onClose, title, message, variant = "info" }: ToastProps) => {
    const t = useTranslate();

    return (
        <div data-variant={variant} className={styles.container}>
            <div>
                <p className={styles.title}>{title}</p>
                {message && <p className={styles.message}>{message}</p>}
            </div>
            <IconButton onPress={onClose} variant="subtle" size="1" aria-label={t("common.notifications.closeButton.label")}>
                <Icon slot={X} />
            </IconButton>
        </div>
    );
};
