import { IconX } from "@tabler/icons-react";

import { ToastProps } from "./types/Toast";

import styles from "./styles/Toast.module.scss";

import { IconButton } from "@/components/IconButton";

export const Toast = ({ onClose, title, message, variant = "info" }: ToastProps) => {
    return (
        <div data-variant={variant} className={styles.container}>
            <div>
                <p className={styles.title}>{title}</p>
                <p className={styles.message}>{message}</p>
            </div>
            <IconButton onPress={onClose} variant="subtle" size="1">
                <IconX />
            </IconButton>
        </div>
    );
};
