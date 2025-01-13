import { PropsWithChildren } from "react";

import styles from "./styles/ModalBody.module.scss";

type ModalBodyProps = PropsWithChildren;

export const ModalBody = ({ children }: ModalBodyProps) => {
    return <div className={styles.container}>{children}</div>;
};
