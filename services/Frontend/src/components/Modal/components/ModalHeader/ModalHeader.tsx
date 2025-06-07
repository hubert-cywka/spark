import { PropsWithChildren } from "react";
import { X } from "lucide-react";

import styles from "./styles/ModalHeader.module.scss";

import { IconButton } from "@/components/IconButton";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type ModalHeaderProps = PropsWithChildren<{ onClose: () => void }>;

export const ModalHeader = ({ children, onClose }: ModalHeaderProps) => {
    const t = useTranslate();

    return (
        <header className={styles.container}>
            <h2 className={styles.header}>{children}</h2>
            <IconButton
                variant="subtle"
                size="1"
                onPress={onClose}
                iconSlot={X}
                tooltip={t("common.modal.closeButton.label")}
                aria-label={t("common.modal.closeButton.label")}
            />
        </header>
    );
};
