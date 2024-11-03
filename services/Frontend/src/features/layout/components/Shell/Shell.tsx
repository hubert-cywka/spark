import { PropsWithChildren } from "react";

import styles from "./styles/Shell.module.scss";
import "server-only";

import { SidePanel } from "@/features/layout/components/SidePanel/SidePanel";

type ShellProps = PropsWithChildren<{ id?: string }>;

export const Shell = ({ children, id }: ShellProps) => {
    return (
        <div id={id} className={styles.shell}>
            <SidePanel />

            <div className={styles.contentContainer}>
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
};
