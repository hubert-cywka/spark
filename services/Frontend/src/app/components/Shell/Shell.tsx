import { PropsWithChildren } from "react";

import styles from "./styles/Shell.module.scss";
import "server-only";

import { Navigation } from "@/app/components/Navigation/Navigation.tsx";

type ShellProps = PropsWithChildren<{ id?: string }>;

export const Shell = ({ children, id }: ShellProps) => {
    return (
        <div id={id} className={styles.shell}>
            <Navigation />

            <div className={styles.contentContainer}>
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
};
