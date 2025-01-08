"use client";

import { Meter } from "react-aria-components";

import styles from "./styles/Progress.module.scss";

import { ProgressProps } from "@/components/Progress/types/Progress";

export const Progress = ({ value, label }: ProgressProps) => {
    return (
        <Meter aria-label={label} value={value}>
            {({ percentage }) => (
                <div className={styles.bar}>
                    <div className={styles.fill} style={{ width: percentage + "%" }} />
                </div>
            )}
        </Meter>
    );
};
