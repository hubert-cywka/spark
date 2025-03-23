import { PropsWithChildren } from "react";

import styles from "./styles/Divider.module.scss";

export const Divider = ({ children }: PropsWithChildren) => {
    return (
        <div className={styles.dividerWrapper}>
            <div className={styles.line} />

            {children && (
                <>
                    <span className={styles.text}>{children}</span>
                    <div className={styles.line} />
                </>
            )}
        </div>
    );
};
