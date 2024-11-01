import { PropsWithChildren } from "react";

import styles from "./styles/Overlay.module.scss";

export const Overlay = ({ children }: PropsWithChildren) => {
    return <div className={styles.overlay}>{children}</div>;
};
