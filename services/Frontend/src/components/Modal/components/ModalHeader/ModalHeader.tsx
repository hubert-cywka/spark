import { PropsWithChildren } from "react";
import { X } from "lucide-react";

import styles from "./styles/ModalHeader.module.scss";

import { Icon } from "@/components/Icon";
import { IconButton } from "@/components/IconButton";

type ModalHeaderProps = PropsWithChildren<{ onClose: () => void }>;

export const ModalHeader = ({ children, onClose }: ModalHeaderProps) => {
    return (
        <div className={styles.container}>
            <h1 className={styles.header}>{children}</h1>

            <IconButton variant="subtle" size="1" onPress={onClose}>
                <Icon slot={X} />
            </IconButton>
        </div>
    );
};
