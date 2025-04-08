import { PropsWithChildren } from "react";
import { X } from "lucide-react";

import styles from "./styles/ModalHeader.module.scss";

import { IconButton } from "@/components/IconButton";

type ModalHeaderProps = PropsWithChildren<{ onClose: () => void }>;

export const ModalHeader = ({ children, onClose }: ModalHeaderProps) => {
    return (
        <header className={styles.container}>
            <h2 className={styles.header}>{children}</h2>
            <IconButton variant="subtle" size="1" onPress={onClose} iconSlot={X} />
        </header>
    );
};
