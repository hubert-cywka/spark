import { PropsWithChildren } from "react";

import styles from "./styles/Shell.module.scss";
import "server-only";

import { SidePanel } from "@/app/(dashboard)/components/SidePanel/SidePanel.tsx";

type DashboardShellProps = PropsWithChildren;

export const DashboardShell = ({ children }: DashboardShellProps) => {
    return (
        <div className={styles.shell}>
            <SidePanel />

            <div className={styles.contentContainer}>
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
};
