import { PropsWithChildren } from "react";

import styles from "./styles/ModalFooter.module.scss";

type ModalFooterProps = PropsWithChildren;

export const ModalFooter = ({ children }: ModalFooterProps) => {
    return <footer className={styles.container}>{children}</footer>;
};
