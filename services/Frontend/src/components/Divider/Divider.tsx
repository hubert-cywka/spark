import { PropsWithChildren } from "react";
import classNames from "clsx";

import styles from "./styles/Divider.module.scss";

type DividerProps = PropsWithChildren<{
    className?: string;
}>;

export const Divider = ({ children, className }: DividerProps) => {
    return (
        <div className={classNames(styles.dividerWrapper, className)} role="separator">
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
